import { State, tags } from "@stepflow/lib/core";
import { ProgressIndicatorTypes } from "@stepflow/types";

const { ul, li } = tags;

export function progressTemplate(
  type: State<ProgressIndicatorTypes>,
  current: State<number>,
  total: number
) {
  const fallback = () => `${current.val} / ${total}`;

  const templates = {
    custom: fallback,
    counter: fallback,
    of: () => `${current.val} of ${total}`,
    percentage: () => `${Math.round((current.val / total) * 100)}%`,
    dots: () =>
      ul(
        { class: "sf-dots" },
        Array.from({ length: total }, (_, i) =>
          li({
            class: i + 1 === current.val ? "sf-dot sf-active" : "sf-dot",
          })
        )
      ),
  };
  return templates[type.val];
}
