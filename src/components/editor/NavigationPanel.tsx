"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/store/editor-store";
import type { NavItem } from "@/types/page";

export function NavigationPanel() {
  const { setNavigation, site } = useEditorStore();
  const navigation = site.navigation;
  const updateItem = (index: number, patch: Partial<NavItem>) => {
    setNavigation({
      ...navigation,
      items: navigation.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation</CardTitle>
        <CardDescription>전역 Header와 Footer에 표시되는 메뉴입니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {navigation.items.map((item, index) => (
          <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3" key={index}>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <Input
                onChange={(event) => updateItem(index, { label: event.target.value })}
                placeholder="Label"
                value={item.label}
              />
              <Input
                onChange={(event) => updateItem(index, { href: event.target.value })}
                placeholder="/about"
                value={item.href}
              />
              <Button
                disabled={navigation.items.length <= 1}
                onClick={() =>
                  setNavigation({
                    ...navigation,
                    items: navigation.items.filter((_, itemIndex) => itemIndex !== index),
                  })
                }
                size="icon"
                variant="ghost"
              >
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        ))}

        <Button
          onClick={() =>
            setNavigation({
              ...navigation,
              items: [...navigation.items, { label: "New", href: "/new" }],
            })
          }
          variant="outline"
        >
          <Plus size={15} />
          메뉴 추가
        </Button>

        <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-950">CTA</p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              onChange={(event) =>
                setNavigation({
                  ...navigation,
                  cta: {
                    label: event.target.value,
                    href: navigation.cta?.href ?? "/contact",
                  },
                })
              }
              placeholder="문의하기"
              value={navigation.cta?.label ?? ""}
            />
            <Input
              onChange={(event) =>
                setNavigation({
                  ...navigation,
                  cta: {
                    label: navigation.cta?.label ?? "문의하기",
                    href: event.target.value,
                  },
                })
              }
              placeholder="/contact"
              value={navigation.cta?.href ?? ""}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
