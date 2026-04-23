import { radiusClassName, styleShadowClassName, styleSpacingClassName } from "@/components/blocks/block-types";
import type { CollectionDefinition, FieldDefinition } from "@/types/collections";
import type { CollectionDetailBlock as CollectionDetailBlockType, PageData, StyleShadow, StyleSpacing, ThemeColors } from "@/types/page";

type CollectionDetailBlockProps = {
  block: CollectionDetailBlockType;
  collections?: CollectionDefinition[];
  colors: ThemeColors;
  radius: PageData["theme"]["radius"];
  shadow: StyleShadow;
  spacing: StyleSpacing;
};

export function CollectionDetailBlock({
  block,
  collections = [],
  colors,
  radius,
  shadow,
  spacing,
}: CollectionDetailBlockProps) {
  const collection = collections.find((item) => item.id === block.props.collectionId);
  const item = findItem(collection, block.props.itemId);
  const fields = pickFields(collection, block.props.showFields);

  if (!collection || !item) {
    return (
      <section className={`${styleSpacingClassName[spacing]} px-5`}>
        <div
          className={`${radiusClassName[radius]} mx-auto max-w-4xl border p-6 text-sm`}
          style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent, color: colors.mutedText }}
        >
          연결된 샘플 데이터를 찾을 수 없습니다.
        </div>
      </section>
    );
  }

  const title = stringifyValue(item.title ?? item.name ?? item.id);

  return (
    <section className={`${styleSpacingClassName[spacing]} px-5`}>
      <article className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <a className="text-sm font-semibold" href={`/${collection.id}`} style={{ color: colors.primary }}>
            {block.props.backLabel ?? "목록으로"}
          </a>
          <p className="mt-6 text-sm font-semibold" style={{ color: colors.primary }}>
            {collection.itemName}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl" style={{ color: colors.text }}>
            {title}
          </h2>
          {block.props.subtitle ? (
            <p className="mt-5 text-lg leading-8" style={{ color: colors.mutedText }}>
              {block.props.subtitle}
            </p>
          ) : null}
        </div>
        <div
          className={`${radiusClassName[radius]} ${styleShadowClassName[shadow]} border p-6`}
          style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent }}
        >
          <dl className="grid gap-5">
            {fields.map((field) => (
              <div className="grid gap-2 border-b pb-4 last:border-b-0 last:pb-0" key={field.id} style={{ borderColor: colors.border ?? colors.accent }}>
                <dt className="text-xs font-semibold uppercase" style={{ color: colors.primary }}>
                  {field.name}
                </dt>
                <dd className="text-base leading-7" style={{ color: colors.text }}>
                  {stringifyValue(item[field.id])}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </section>
  );
}

function findItem(collection: CollectionDefinition | undefined, itemId: string | undefined) {
  if (!collection) {
    return null;
  }

  if (!itemId) {
    return collection.sampleData[0] ?? null;
  }

  return collection.sampleData.find((item) => item.id === itemId || item.slug === itemId) ?? collection.sampleData[0] ?? null;
}

function pickFields(collection: CollectionDefinition | undefined, showFields: string[] | undefined) {
  if (!collection) {
    return [];
  }

  if (!showFields || showFields.length === 0) {
    return collection.fields.slice(0, 6);
  }

  return showFields
    .map((fieldId) => collection.fields.find((field) => field.id === fieldId))
    .filter((field): field is FieldDefinition => Boolean(field));
}

function stringifyValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "예" : "아니오";
  }

  if (value === null || typeof value === "undefined") {
    return "-";
  }

  return String(value);
}
