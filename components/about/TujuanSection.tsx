"use client";

import { FadeIn } from "@/components/ui/motion";

export type TujuanItemProps = {
  item: string;
};

function TujuanItem({ item, index }: TujuanItemProps & { index: number }) {
  return (
    <li className="my-8">
      <FadeIn direction="up" delay={index * 0.08}>
        <span className="text-5xl font-bold text-forest-900 leading-none block mb-6">
          0{index + 1}
        </span>
        <div className="h-px bg-forest-600 mb-8" />
        <p className="text-base text-muted dark:text-gray-300 leading-relaxed">{item}</p>
      </FadeIn>
    </li>
  );
}

type TujuanSectionProps = {
  tujuan: string[];
};

export function TujuanSection({ tujuan }: TujuanSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-forest-900">
            Tujuan
          </h2>
        </FadeIn>
        <ol className="space-y-0">
          {tujuan.map((item, index) => (
            <TujuanItem key={index} item={item} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}