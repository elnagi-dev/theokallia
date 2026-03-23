import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

const NewsLetter = () => {
  return (
    <section className="container mx-auto my-10 flex flex-col items-center justify-center space-y-6">
      <p className="max-w-120 text-center text-xl">
        Subscribe to receive exclusive offers, new collection updates, and
        timeless jewelry inspiration.
      </p>

      <div className="mx-auto flex w-full max-w-2xl gap-2">
        <Input
          type="email"
          placeholder="Email"
          className="h-14 rounded-none border-gray-200 text-lg placeholder:text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button className="h-14 w-14 shrink-0 rounded-none">
          <ArrowRight className="size-6 text-white" />
        </Button>
      </div>
    </section>
  )
}

export default NewsLetter
