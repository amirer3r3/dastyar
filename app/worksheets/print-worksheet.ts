import { FONT_CSS_VARIABLES } from "@/app/lib/project-fonts";

const A4_OVERRIDE_STYLES = (origin: string) => `
  @page { size: A4 portrait; margin: 0; }
  html, body {
    margin: 0;
    padding: 0;
    background: #fff !important;
  }
  body {
    display: flex;
    justify-content: center;
  }
  #print-area {
    width: 210mm !important;
    min-height: 297mm !important;
    max-width: none !important;
    transform: none !important;
    box-shadow: none !important;
    margin: 0 auto !important;
  }
  .a4-sheet {
    width: 210mm !important;
    min-height: 297mm !important;
    max-width: none !important;
    box-shadow: none !important;
  }
  .worksheet-theme-floral {
    background-image: url("${origin}/worksheets/themes/floral.webp") !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  #print-area.worksheet-print-multi {
    min-height: 0 !important;
    page-break-inside: auto !important;
  }
  .worksheet-cartoon-page {
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    page-break-after: always;
    break-after: page;
  }
  .worksheet-cartoon-page img {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .worksheet-cartoon-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }
  .worksheet-asman-page {
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    page-break-after: always;
    break-after: page;
  }
  .worksheet-asman-page img {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .worksheet-asman-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }
  .standard-exam-page {
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    page-break-after: always;
    break-after: page;
  }
  .standard-exam-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }
  .a4-page {
    padding: 8mm !important;
    box-sizing: border-box !important;
  }
  .exam-outer-frame,
  .standard-exam-outer.exam-outer-frame {
    border: 2px solid #000000 !important;
    padding: 3px !important;
    min-height: calc(297mm - 16mm) !important;
    box-sizing: border-box !important;
  }
  .exam-inner-frame,
  .standard-exam-inner.exam-inner-frame {
    border: 1px solid #000000 !important;
    box-sizing: border-box !important;
  }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  #print-area,
  #print-area *,
  #manual-print-area,
  #manual-print-area * {
    font-feature-settings: "ss01" 1 !important;
    -moz-font-feature-settings: "ss01" 1 !important;
  }
`;

function copyDocumentStyles(targetDoc: Document) {
  document.querySelectorAll('link[rel="stylesheet"]').forEach((node) => {
    targetDoc.head.appendChild(node.cloneNode(true));
  });
  document.querySelectorAll("style").forEach((node) => {
    targetDoc.head.appendChild(node.cloneNode(true));
  });
}

function mirrorDocumentRoot(targetDoc: Document) {
  const { documentElement: srcHtml, body: srcBody } = document;
  const { documentElement: dstHtml, body: dstBody } = targetDoc;

  dstHtml.lang = srcHtml.lang;
  dstHtml.dir = srcHtml.dir;
  dstHtml.className = srcHtml.className;

  dstBody.className = srcBody.className;
  if (srcBody.getAttribute("style")) {
    dstBody.setAttribute("style", srcBody.getAttribute("style") ?? "");
  }
}

/** مقادیر واقعی var(--font-*) را از صفحهٔ اصلی می‌خواند تا در iframe چاپ همان فونت اعمال شود */
function injectResolvedFontVariables(targetDoc: Document) {
  const computed = getComputedStyle(document.body);
  const declarations: string[] = [];

  for (const name of FONT_CSS_VARIABLES) {
    const value = computed.getPropertyValue(name).trim();
    if (value) {
      declarations.push(`${name}: ${value};`);
    }
  }

  if (declarations.length === 0) return;

  const style = targetDoc.createElement("style");
  style.setAttribute("data-print-font-vars", "true");
  style.textContent = `:root, html, body, #print-area, #print-area * { ${declarations.join(" ")} }`;
  targetDoc.head.appendChild(style);
}

/** فونت‌های استفاده‌شده در پیش‌نمایش را قبل از چاپ لود می‌کند */
async function ensurePrintFontsLoaded(
  targetDoc: Document,
  printRoot: HTMLElement,
  livePreviewRoot: HTMLElement
) {
  const sample = "آب 123";
  const families = new Set<string>();

  const computedBody = getComputedStyle(document.body);
  for (const name of FONT_CSS_VARIABLES) {
    const stack = computedBody.getPropertyValue(name).trim();
    if (stack) families.add(stack);
  }

  livePreviewRoot.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const ff = getComputedStyle(el).fontFamily?.trim();
    if (ff) families.add(ff);
  });

  printRoot.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const ff = targetDoc.defaultView?.getComputedStyle(el).fontFamily?.trim();
    if (ff) families.add(ff);
  });

  const loaders: Promise<unknown>[] = [];
  for (const family of families) {
    loaders.push(
      targetDoc.fonts.load(`16px ${family}`, sample).catch(() => undefined)
    );
    loaders.push(
      document.fonts.load(`16px ${family}`, sample).catch(() => undefined)
    );
  }

  await Promise.all(loaders);
  await Promise.all([
    document.fonts.ready,
    targetDoc.fonts.ready.catch(() => undefined),
  ]);
}

function waitForStylesheets(doc: Document): Promise<void> {
  const links = Array.from(
    doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
  );
  if (links.length === 0) return Promise.resolve();

  return Promise.all(
    links.map(
      (link) =>
        new Promise<void>((resolve) => {
          if (link.sheet) {
            resolve();
            return;
          }
          link.addEventListener("load", () => resolve(), { once: true });
          link.addEventListener("error", () => resolve(), { once: true });
        })
    )
  ).then(() => undefined);
}

export function printWorksheetFromDom(): boolean {
  const source = document.getElementById("print-area");
  if (!source) return false;

  const origin = window.location.origin;
  const clone = source.cloneNode(true) as HTMLElement;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "worksheet-print");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    iframe.remove();
    return false;
  }

  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <base href="${origin}/" />
</head>
<body></body>
</html>`);
  doc.close();

  mirrorDocumentRoot(doc);
  copyDocumentStyles(doc);
  injectResolvedFontVariables(doc);

  const override = doc.createElement("style");
  override.textContent = A4_OVERRIDE_STYLES(origin);
  doc.head.appendChild(override);

  doc.body.innerHTML = clone.outerHTML;

  const printRoot = doc.getElementById("print-area");
  if (!printRoot) {
    iframe.remove();
    return false;
  }

  const triggerPrint = async () => {
    try {
      await waitForStylesheets(doc);
      await ensurePrintFontsLoaded(doc, printRoot, source);
    } catch {
      /* continue to print */
    }

    win.focus();
    win.print();
    window.setTimeout(() => {
      if (iframe.isConnected) iframe.remove();
    }, 2000);
  };

  win.onafterprint = () => {
    if (iframe.isConnected) iframe.remove();
  };

  void triggerPrint();
  return true;
}
