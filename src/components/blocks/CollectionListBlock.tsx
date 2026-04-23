import { radiusClassName, styleShadowClassName, styleSpacingClassName } from "@/components/blocks/block-types";
import type { CollectionDefinition, FieldDefinition } from "@/types/collections";
import type { CollectionListBlock as CollectionListBlockType, PageData, StyleShadow, StyleSpacing, ThemeColors } from "@/types/page";

type CollectionListBlockProps = {
  block: CollectionListBlockType;
  collections?: CollectionDefinition[];
  colors: ThemeColors;
  radius: PageData["theme"]["radius"];
  shadow: StyleShadow;
  spacing: StyleSpacing;
};

export function CollectionListBlock({
  block,
  collections = [],
  colors,
  radius,
  shadow,
  spacing,
}: CollectionListBlockProps) {
  const collection = collections.find((item) => item.id === block.props.collectionId);
  const items = (collection?.sampleData ?? []).slice(0, block.props.itemLimit ?? 6);
  const fields = pickFields(collection, block.props.showFields);

  return (
    <section className={`${styleSpacingClassName[spacing]} px-5`}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold" style={{ color: colors.primary }}>
            {collection?.name ?? "Collection"}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>
            {block.props.title}
          </h2>
          {block.props.subtitle ? (
            <p className="mt-4 leading-7" style={{ color: colors.mutedText }}>
              {block.props.subtitle}
            </p>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div
            className={`${radiusClassName[radius]} mt-8 border p-6 text-sm`}
            style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent, color: colors.mutedText }}
          >
            {block.props.emptyText ?? "표시할 데이터가 없습니다."}
          </div>
        ) : (
          <div className={block.variant === "table" ? "mt-10 overflow-hidden rounded-2xl border" : "mt-10 grid gap-4 md:grid-cols-3"} style={block.variant === "table" ? { borderColor: colors.border ?? colors.accent } : undefined}>
            {block.variant === "table" ? (
              <CollectionTable colors={colors} fields={fields} items={items} />
            ) : (
              items.map((item, index) => (
                <CollectionCard
                  colors={colors}
                  detailSlug={block.props.detailSlug}
                  fields={fields}
                  item={item}
                  key={String(item.id ?? item.slug ?? index)}
                  radius={radius}
                  shadow={shadow}
                />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function CollectionCard({
  colors,
  detailSlug,
  fields,
  item,
  radius,
  shadow,
}: {
  colors: ThemeColors;
  detailSlug?: string;
  fields: FieldDefinition[];
  item: Record<string, unknown>;
  radius: PageData["theme"]["radius"];
  shadow: StyleShadow;
}) {
  const title = stringifyValue(item.title ?? item.name ?? item.id);
  const imageValue = stringifyValue(item.image);
  const href = detailSlug && item.slug ? `/${detailSlug}/${String(item.slug)}` : "#";

  return (
    <article
      className={`${radiusClassName[radius]} ${styleShadowClassName[shadow]} overflow-hidden border`}
      style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent }}
    >
      {imageValue ? (
        <div className="flex h-36 items-end p-4 text-xs font-semibold" style={{ backgroundColor: colors.background, color: colors.mutedText }}>
          {imageValue}
        </div>
      ) : null}
      <div className="p-5">
        <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
          {title}
        </h3>
        <dl className="mt-4 grid gap-3">
          {fields
            .filter((field) => field.id !== "title" && field.id !== "image")
            .map((field) => (
              <div className="grid gap-1" key={field.id}>
                <dt className="text-xs font-semibold" style={{ color: colors.primary }}>
                  {field.name}
                </dt>
                <dd className="text-sm leading-6" style={{ color: colors.mutedText }}>
                  {stringifyValue(item[field.id])}
                </dd>
              </div>
            ))}
        </dl>
        <a className={`${radiusClassName[radius]} mt-5 inline-flex px-4 py-2 text-sm font-semibold text-white`} href={href} style={{ backgroundColor: colors.primary }}>
          자세히 보기
        </a>
      </div>
    </article>
  );
}

function CollectionTable({
  colors,
  fields,
  items,
}: {
  colors: ThemeColors;
  fields: FieldDefinition[];
  items: Record<string, unknown>[];
}) {
  return (
    <table className="w-full border-collapse text-left text-sm" style={{ backgroundColor: colors.surface }}>
      <thead style={{ backgroundColor: colors.background, color: colors.text }}>
        <tr>
          {fields.map((field) => (
            <th className="px-4 py-3 font-semibold" key={field.id}>
              {field.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr className="border-t" key={String(item.id ?? item.slug ?? index)} style={{ borderColor: colors.border ?? colors.accent }}>
            {fields.map((field) => (
              <td className="px-4 py-3" key={field.id} style={{ color: field.id === "title" ? colors.text : colors.mutedText }}>
                {stringifyValue(item[field.id])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function pickFields(collection: CollectionDefinition | undefined, showFields: string[] | undefined) {
  if (!collection) {
    return [];
  }

  if (!showFields || showFields.length === 0) {
    return collection.fields.slice(0, 4);
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
