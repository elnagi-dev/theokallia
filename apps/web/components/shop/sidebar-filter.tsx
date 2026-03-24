import React from 'react'
import { Plus, Minus } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const categories = ['Rings', 'Bracelets', 'Necklace', 'Earrings']

const filterSections = [
  {
    value: 'categories',
    trigger: 'Categories',
    content: (
      <ul className="flex flex-col gap-2">
        {categories.map((cat) => (
          <li
            key={cat}
            className="text-sm font-light tracking-wide text-foreground/80"
          >
            {cat}
          </li>
        ))}
      </ul>
    ),
  },
  { value: 'price', trigger: 'Price', content: null },
  { value: 'best-seller', trigger: 'Best seller', content: null },
  { value: 'new-arrival', trigger: 'New arrival', content: null },
]

const SidebarFilter = () => {
  return (
    <section className="w-[280px] px-6 font-serif">
      <h2 className="mb-4 font-le-jour text-4xl font-light tracking-tight">
        Filter
      </h2>

      <Accordion
        type="multiple"
        defaultValue={['categories']}
        className="w-full"
      >
        {filterSections.map((item, index) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className={`${index === 0 ? 'border-t' : ''} border-b border-gray-500 py-1`}
          >
            <AccordionTrigger className="group flex items-center justify-between py-4 font-le-jour text-xl font-light tracking-tight hover:no-underline">
              <span>{item.trigger}</span>
            </AccordionTrigger>
            {item.content && (
              <AccordionContent className="pt-1 pb-4">
                {item.content}
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-8 flex justify-center overflow-hidden">
        <h1
          className="pointer-events-none ml-16 rotate-180 font-le-jour text-9xl font-extrabold tracking-normal text-gray-50 uppercase select-none [writing-mode:vertical-rl]"
          style={{ transform: 'scaleX(2.05)', transformOrigin: 'center' }}
        >
          Theokallia
        </h1>
      </div>
    </section>
  )
}

export default SidebarFilter
