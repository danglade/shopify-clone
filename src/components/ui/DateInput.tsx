'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'

export const DateInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <Input
      ref={ref}
      {...props}
      style={{
        width: '6rem',
        textAlign: 'center',
        ...props.style,
      }}
    />
  )
})

DateInput.displayName = 'DateInput' 