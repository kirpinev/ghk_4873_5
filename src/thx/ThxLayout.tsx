import { Typography } from "@alfalab/core-components/typography";
import img from "../assets/img.png";
import { thxSt } from "./style.css";
import { appSt } from "../style.css.ts";
import { ButtonMobile } from "@alfalab/core-components/button/mobile";

export const ThxLayout = () => {
  const submit = () => {
    window.gtag("event", "4873_get_sub", {
      variant_name: "4873_5",
    });
  };

  return (
    <>
      <div className={thxSt.container}>
        <img
          alt="Картинка ракеты"
          src={img}
          width={220}
          className={thxSt.rocket}
        />
        <Typography.TitleResponsive
          font="system"
          tag="h1"
          view="large"
          defaultMargins
          weight="bold"
        >
          Сервис ещё в работе
        </Typography.TitleResponsive>
        <Typography.Text tag="p" view="primary-medium">
          Мы выбираем лучшие штуки,чтобы вам точно понравилось. С нетерпением
          ждём, когда всё заработает,чтобы показать вам.
        </Typography.Text>
      </div>

      <div className={appSt.bottomBtnThx}>
        <ButtonMobile
          block
          view="primary"
          href="https://online.alfabank.ru/"
          onClick={submit}
        >
          Спасибо, понятно!
        </ButtonMobile>
      </div>
    </>
  );
};
