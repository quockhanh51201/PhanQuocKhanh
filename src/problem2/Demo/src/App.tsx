import { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";
import { SVGS } from "./assets/svg/SVG";
import { ToastContainer, toast } from 'react-toastify'

const API_URL = "https://api.coingecko.com/api/v3/exchange_rates";

interface ExchangeRates {
  [key: string]: { value: number };
}

function App() {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [fromCurrency, setFromCurrency] = useState<string>("usd");
  const [toCurrency, setToCurrency] = useState<string>("vnd");
  const [amount, setAmount] = useState<number>(1);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setRates(data.rates));
  }, []);

  useEffect(() => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      const rate = rates[toCurrency].value / rates[fromCurrency].value;
      setConvertedAmount(parseFloat((amount * rate).toFixed(4)));
    }
    if (amount < 1) {
      toast('số tiền chuyển đổi không được bé hơn 1 !')
      setAmount(1);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const currencyOptions = Object.keys(rates).map((key) => ({
    value: key,
    label: (
      <div className="flex items-center">
        <img src={SVGS[key as keyof typeof SVGS] || SVGS.def} alt={key} className="w-5 h-5 mr-2" />
        <p className="text-green-600">{key.toUpperCase()}</p>
      </div>
    ),
  }));

  return (
    <>
    <ToastContainer />
    <div className="flex flex-col items-center bg-[#123a1c] min-h-screen py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Chuyển đổi tiền tệ</h1>
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[500px]">
        <p className="text-center text-lg text-gray-800 font-semibold mb-4">
          Đổi tiền {fromCurrency.toUpperCase()} sang {toCurrency.toUpperCase()} theo tỷ giá chuyển đổi thực
        </p>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Số tiền:</label>
          <input
            type="number"
            className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-green-700"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="flex items-center  justify-between mb-4">
          <div className="w-5/12">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Từ:</label>
            <Select
              options={currencyOptions}
              value={currencyOptions.find((option) => option.value === fromCurrency)}
              onChange={(selectedOption: any) => setFromCurrency(selectedOption.value)}
            />
          </div>
          <button
            className="p-3 bg-green-500 text-white rounded-full shadow-lg focus:outline-none"
            onClick={swapCurrencies}
          >
            ⇄
          </button>
          <div className="w-5/12">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Đổi thành:</label>
            <Select
              options={currencyOptions}
              value={currencyOptions.find((option) => option.value === toCurrency)}
              onChange={(selectedOption: any) => setToCurrency(selectedOption.value)}
            />
          </div>
        </div>
        <div className="text-lg font-semibold text-center text-green-700">
          {amount} {fromCurrency.toUpperCase()} = {convertedAmount} {toCurrency.toUpperCase()}
        </div>
        <p className="text-center text-gray-500 text-sm mt-2">
          Công cụ chuyển đổi by Phan Quốc Khánh
        </p>
      </div>
    </div>
    </>
  );
}

export default App;