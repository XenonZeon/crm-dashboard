import { useState } from "react"

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function StatusDropdown ({value, onChange} : Props) {
    const [open, setOpen] = useState(false)
    
    function handleOpen () {
      setOpen(!open)
      
    }
    
    const options : string[] = ["active", "inactive"]


    return(
      <div className="relative">
        <div
          onClick={handleOpen}
          className="bg-[#0A0D1A] border border-[#1E2540] rounded-lg px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between"
          style={{ color: value ? "#E8EAFF" : "#565E80" }}
        >
          <span>{value || "Выберите статус"}</span>
          <span style={{ color: "#565E80" }}>▾</span>
        </div>
        {open && (
          <div
            className="absolute top-full left-0 right-0 z-10 rounded-lg overflow-hidden mt-1"
            style={{ background: "#0A0D1A", border: "1px solid #1E2540" }}
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => { onChange(option); setOpen(false) }}
                className="px-4 py-2.5 text-sm cursor-pointer hover:opacity-80"
                style={{ color: "#E8EAFF" }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    )
}