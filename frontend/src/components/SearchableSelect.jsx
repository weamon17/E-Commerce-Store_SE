import { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { removeVietnameseTones } from "../utils/format.js"; // Import hàm bỏ dấu

export default function SearchableSelect({
  items,
  selected,
  onChange,
  placeholder,
  disabled = false,
}) {
  const [query, setQuery] = useState("");

  // Lọc danh sách dựa trên từ khóa tìm kiếm (không phân biệt dấu)
  const filteredItems =
    query === ""
      ? items
      : items.filter((item) =>
          removeVietnameseTones(item.name.toLowerCase())
            .includes(removeVietnameseTones(query.toLowerCase()))
        );

  return (
    <Combobox value={selected} onChange={onChange} disabled={disabled}>
      <div className="relative">
        {/* Ô tìm kiếm */}
        <Combobox.Input
          className="w-full border rounded-md p-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
          placeholder={placeholder}
          displayValue={(item) => item?.name || ""} // Hiển thị tên khi đã chọn
          onChange={(event) => setQuery(event.target.value)}
        />
        {/* Nút mũi tên */}
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {/* Danh sách xổ xuống */}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Không tìm thấy.
              </div>
            ) : (
              filteredItems.map((item) => (
                <Combobox.Option
                  key={item.code}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-sky-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      {/* Tên Tỉnh/Huyện/Xã */}
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.name}
                      </span>
                      {/* Dấu check khi đã chọn */}
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-sky-600"
                          }`}
                        >
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}