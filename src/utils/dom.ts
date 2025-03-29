export function vIf(condition: () => boolean, content: () => Node): () => Node {
  return () => (condition() ? content() : new Text("")); // 👈 ensures bind() always has something to track
}

export function vIfElse(
  condition: () => boolean,
  ifContent: () => Node,
  elseContent: () => Node
): () => Node {
  return () => (condition() ? ifContent() : elseContent());
}
