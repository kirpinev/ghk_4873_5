declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      e: "event",
      action: string,
      variant_name: Record<string, string>,
    ) => void;
  }
}

interface Payload {
  sum: number;
  payment: number | string;
  term: number | string;
  commission: number | string;
}

export const sendDataToGA = async (payload: Payload) => {
  try {
    const now = new Date();
    const date = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    await fetch(
      "https://script.google.com/macros/s/AKfycbxadtCTueO42bjpYMQobZkrecB2rrs6pNyQXRLku-jxlwt5vaiHI4KB86LDLI33itvF/exec",
      {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify({
          date,
          form_name: "forms1",
          variant: "ghk_4873_5",
          ...payload,
        }),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("Error!", error);
  }
};
