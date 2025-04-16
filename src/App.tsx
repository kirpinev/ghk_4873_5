import { ButtonMobile } from "@alfalab/core-components/button/mobile";

import { Typography } from "@alfalab/core-components/typography";

import { LS, LSKeys } from "./ls";
import { appSt } from "./style.css";
import { ThxLayout } from "./thx/ThxLayout";
import { Gap } from "@alfalab/core-components/gap";
import { ChangeEvent, useState } from "react";
import { sendDataToGA } from "./utils/events.ts";
import { SliderInput } from "@alfalab/core-components/slider-input";
import { AmountInput } from "@alfalab/core-components/amount-input";
import star from "./assets/star.png";
import payment from "./assets/payment.png";
import cal from "./assets/cal.png";
import money from "./assets/money.png";
import { BottomSheet } from "@alfalab/core-components/bottom-sheet";
import Picker, { PickerValue } from "react-mobile-picker";

const selections: { [k: string]: number[] } = {
  month: Array.from({ length: 365 }, (_, i) => i + 1),
};

function getDayLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${n} день`;
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${n} дня`;
  } else {
    return `${n} дней`;
  }
}

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(10_000);
  const [thx, setThx] = useState(LS.getItem(LSKeys.ShowThx, false));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickerValue, setPickerValue] = useState<PickerValue>({
    month: 30,
  });

  const submit = () => {
    setLoading(true);

    sendDataToGA({
      sum: amount,
      payment: "",
      term: "",

      commission: Math.floor(
        (amount / 1000) * 50 * (Number(pickerValue.month) / 30),
      ),
    }).then(() => {
      setLoading(false);
      setThx(true);
      LS.setItem(LSKeys.ShowThx, true);
    });
  };

  const formatPipsValue = (value: number) =>
    `${value.toLocaleString("ru-RU")} ₽`;

  const handleSumInputChange = (
    _: ChangeEvent<HTMLInputElement>,
    { value }: { value: number | string },
  ) => {
    setAmount(Number(value) / 100);
  };

  const handleSumSliderChange = ({ value }: { value: number }) => {
    setAmount(value);
  };

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  if (thx) {
    return <ThxLayout />;
  }

  return (
    <>
      <div className={appSt.container}>
        <Typography.TitleResponsive
          font="system"
          tag="h3"
          view="medium"
          className={appSt.productsTitle}
        >
          Альфа-лимит
        </Typography.TitleResponsive>
        <Gap size={8} />
        <Typography.Text
          tag="p"
          view="primary-medium"
          style={{ marginBottom: 0, paddingLeft: "1rem", paddingRight: "1rem" }}
        >
          Доступный лимит без процентов
        </Typography.Text>

        <Gap size={28} />

        <Typography.Text
          tag="p"
          view="primary-small"
          weight="bold"
          style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
        >
          Выберите сумму и срок
        </Typography.Text>

        <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
          <SliderInput
            block={true}
            value={amount * 100}
            sliderValue={amount}
            onInputChange={handleSumInputChange}
            onSliderChange={handleSumSliderChange}
            onBlur={() => setAmount((prev) => clamp(prev, 100, 30_000))}
            min={100}
            max={30_000}
            range={{ min: 100, max: 30_000 }}
            pips={{
              mode: "values",
              values: [100, 30_000],
              format: { to: formatPipsValue },
            }}
            step={1}
            Input={AmountInput}
            labelView="outer"
            size={48}
          />
        </div>

        <Gap size={28} />

        <div
          className={appSt.reminder}
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <Typography.Text tag="p" view="primary-small" color="secondary">
              До погашения
            </Typography.Text>
            <Typography.Text
              tag="p"
              view="primary-large"
              style={{ marginBottom: 0, fontSize: "1.5rem" }}
              weight="bold"
            >
              {getDayLabel(pickerValue.month as number)}
            </Typography.Text>
          </div>
          <Typography.Text
            tag="p"
            view="primary-small"
            color="secondary"
            style={{ marginBottom: 0 }}
            onClick={() => setIsModalOpen(true)}
          >
            Увеличить срок {">"}
          </Typography.Text>
        </div>

        <Gap size={12} />

        <div className={appSt.reminder}>
          <img src={star} width={24} height={24} alt="" />
          <Typography.Text
            tag="p"
            view="primary-small"
            style={{ marginBottom: 0 }}
          >
            Можно взять еще в любой момент — пересчитаем сумму подписки. Лимит
            восстановится с погашением.
          </Typography.Text>
        </div>

        <Gap size={28} />
      </div>

      <BottomSheet
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Выберите срок"
        hasCloser={true}
        swipeable={false}
      >
        <div style={{ overflow: "hidden", width: "100%" }}>
          <Picker value={pickerValue} onChange={setPickerValue}>
            {Object.keys(selections).map((name) => (
              <Picker.Column key={name} name={name}>
                {selections[name].map((option) => (
                  <Picker.Item key={option} value={option}>
                    {option}
                  </Picker.Item>
                ))}
              </Picker.Column>
            ))}
          </Picker>
        </div>
      </BottomSheet>

      <Gap size={96} />

      <div className={appSt.bottomBtnThx}>
        <div className={appSt.result}>
          <Typography.Text
            tag="p"
            view="primary-medium"
            style={{ marginBottom: 0, textAlign: "center" }}
          >
            Вы берете
          </Typography.Text>
          <Typography.Text
            tag="p"
            view="primary-medium"
            weight="bold"
            style={{ marginBottom: 0, textAlign: "center" }}
          >
            {amount.toLocaleString("ru-RU")} ₽
          </Typography.Text>

          <Gap size={12} />

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "73px",
              }}
            >
              <img src={payment} width={25} height={25} alt="" />
              <Typography.Text
                tag="p"
                view="primary-medium"
                color="secondary"
                style={{ marginBottom: 0 }}
              >
                платёж
              </Typography.Text>
              <Typography.Text
                tag="p"
                view="primary-medium"
                style={{ marginBottom: 0 }}
              >
                {Math.floor(
                  amount / (pickerValue.month as number),
                ).toLocaleString("ru-RU")}{" "}
                ₽
              </Typography.Text>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "73px",
                }}
              >
                <img src={cal} width={25} height={25} alt="" />
                <Typography.Text
                  tag="p"
                  view="primary-medium"
                  color="secondary"
                  style={{ marginBottom: 0 }}
                >
                  срок
                </Typography.Text>
                <Typography.Text
                  tag="p"
                  view="primary-medium"
                  style={{ marginBottom: 0 }}
                >
                  {getDayLabel(pickerValue.month as number)}
                </Typography.Text>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                minWidth: "73px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img src={money} width={25} height={25} alt="" />
                <Typography.Text
                  tag="p"
                  view="primary-medium"
                  color="secondary"
                  style={{ marginBottom: 0 }}
                >
                  комиссия
                </Typography.Text>
                <Typography.Text
                  tag="p"
                  view="primary-medium"
                  style={{ marginBottom: 0 }}
                >
                  {Math.floor(
                    (amount / 1000) * 50 * (Number(pickerValue.month) / 30),
                  ).toLocaleString("ru-RU")}{" "}
                  ₽
                </Typography.Text>
              </div>
            </div>
          </div>
        </div>
        <Gap size={16} />
        <ButtonMobile
          loading={loading}
          onClick={submit}
          block
          view="primary"
          href=""
        >
          Перевести на Альфа-Карту
        </ButtonMobile>
      </div>
    </>
  );
};
