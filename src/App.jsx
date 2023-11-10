import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import "../node_modules/bulma/css/bulma.min.css";


function App() {
  const [cepData, setCepData] = useState({});
  const [cepInput, setCepInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [commonNames, setCommonNames] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [cepInputError, setCepInputError] = useState(false);
  const [nameInputError, setNameInputError]= useState(false)
  const apiCep = "https://viacep.com.br/ws/";
  const apiName = "https://servicodados.ibge.gov.br/api/v2/censos/nomes";


  const handleSearchClick = async () => {
    try {
      const response = await fetch(apiCep + cepInput + "/json/");
      if (!response.ok) {
        throw new Error("Erro ao buscar os dados");
      }
      const data = await response.json();
      setCepData(data);

      if (data.ddd) {
        const responseName = await fetch(
          `${apiName}/${nameInput}?localidade=${data.ddd}`
        );
        if (!responseName.ok) {
          throw new Error("Erro ao buscar os dados");
        }
        const dataName = await responseName.json();
        setCommonNames(dataName[0].res);
        console.log(commonNames);
        const newData = dataName[0].res.map((item) => ({
          periodo: item.periodo
            .replace("[", "")
            .replace("]", "")
            .replace("[", "")
            .replace("[", "")
            .replace("[", "")
            .replace(",", " -")
            ,
          frequencia: item.frequencia,
        }));
        setCommonNames(newData);
        setChartData(newData);
        console.log(chartData);
      } else {
        console.error("DDD não encontrado nos dados do CEP");
        setCepInputError(true);
        return;
      }
    } catch (error) {
      console.error("Erro:", error);
      setNameInputError(true)

    }
  };

  return (
    <div className="container">
      <div className="box">
        <div className="field">
          <label htmlFor="cep" className="label">CEP</label>
          <input
            className="input is-primary"
            type="text"
            name="cep"
            id="cep"
            value={cepInput}
            onChange={(e) => {
              setCepInput(e.target.value);
              // Reset the error flag when the user changes the input
              setCepInputError(false);
            }}
          />
          {cepInputError && <p>CEP inválido</p>}
        </div>
        <div className="field">
          <label htmlFor="name" className="label">Nome</label>
          <input
            className="input is-primary"
            type="text"
            name="name"
            id="name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          {nameInputError && <p>Nome não consta na base de dados</p>}
        </div>
        <button onClick={handleSearchClick} className="button">
          Pesquisar
        </button>
      </div>
      <ul>
        <li>Região: {cepData.ddd}</li>
      </ul>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="frequencia" fill="#00d1b2">
            <LabelList dataKey="frequencia" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
