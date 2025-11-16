const InputUser = ({ name, icon, placeholder, value, onChange, type }) => {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-lg font-semibold text-gray-800" htmlFor={name}>
        {name}
      </label>
      <div className="relative flex items-center">
        <div className="absolute z-10 text-gray-600 ml-4">{icon}</div>
        <input
          id={name}
          className="w-full py-3 pl-12 pr-4 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-gray-400 transition-all duration-200"
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default InputUser;
