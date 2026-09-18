import type { CartoonPageRole } from "./worksheet-paginate";

/** صفحهٔ تکی یا صفحهٔ اول چندبرگه‌ای — سربرگ کامل، بدون پاورقی */
export const CARTOON_CAR1_SRC = "/worksheets/themes/car1.svg";
/** صفحات ۲، ۳ و ۴ */
export const CARTOON_CAR2_SRC = "/worksheets/themes/car2.svg";

function themeSrcForRole(role: CartoonPageRole): string {
  return role === "single" || role === "first" ? CARTOON_CAR1_SRC : CARTOON_CAR2_SRC;
}

export default function CartoonThemeArt({ role }: { role: CartoonPageRole }) {
  return (
    <div className="worksheet-cartoon-theme-art" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={themeSrcForRole(role)}
        alt=""
        className="h-full w-full object-fill print:block"
      />
    </div>
  );
}
