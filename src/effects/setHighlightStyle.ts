import { getUIHandler } from "@stepflow/helpers";

export function setHighlightStyle(color = "rgba(0, 0, 0, 0.8)", opacity = 0.3) {
  const { highlight } = getUIHandler();
  highlight?.style.setProperty(
    "--box-shadow",
    `${color} 0 0 1px 2px,  rgba(0, 0, 0, ${opacity}) 0 0 0 5000px`
  );
}
