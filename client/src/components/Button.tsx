import { ReactNode } from "react"

type ButtonProps = {
    children: ReactNode
    className?: string
    disabled?: boolean
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button = ({children, className, ...args}: ButtonProps) => {
  return <button  className={`bg-red-700 text-white/95 font-medium rounded py-2.5 ${className}`} {...args}>{children}</button>
}

export default Button
