import { useState } from "react"

const maxLength = 200

type CellLongTextProps = {
  value: string
}

export const CellLongText = ({ value }: CellLongTextProps) => {
  const [showMore, setShowMore] = useState(false)

  if (value.length < maxLength) return (
    <div className="w-96 break-words overflow-hidden text-wrap">
      {value}
    </div>
  )

  if (showMore)
    return (
      <div className="w-96 break-words overflow-hidden text-wrap">
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
    <div className="w-96 break-words overflow-hidden text-wrap">
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
