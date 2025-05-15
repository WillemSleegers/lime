import { useState } from "react"

const maxLength = 200

type CellLongTextProps = {
  value: string
}

export const CellLongText = ({ value }: CellLongTextProps) => {
  const [showMore, setShowMore] = useState(false)

  if (value.length < maxLength) return value

  if (showMore)
    return (
      <div className="max-w-[600px]">
        {value}
        <span
          onClick={() => setShowMore((prev) => !prev)}
          className="cursor-pointer"
        >
          {" "}
          [-]
        </span>
      </div>
    )

  return (
    <div>
      {value.substring(0, maxLength)}{" "}
      <span
        onClick={() => setShowMore((prev) => !prev)}
        className="cursor-pointer"
      >
        ...
      </span>
    </div>
  )
}
