import { tags } from "@stepflow/lib/core";

const { div } = tags;

export function card(component: {
  header?: () => HTMLElement;
  body?: () => HTMLElement;
  footer?: () => HTMLElement;
  attrs?: { [key: string]: unknown };
  classes?: string;
}) {
  const { header, body, footer, classes = "", attrs } = component; // default to empty string
  return div(
    { class: `sf-card ${classes}`, ...attrs },
    header && div({ class: "sf-card-header" }, header()),
    body && div({ class: "sf-card-body" }, body()),
    footer && div({ class: "sf-card-footer" }, footer())
  );
}
