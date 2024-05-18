import React, { useState } from "react";
import InputForm from "./InputForm";
import Results from "./Results";

const TransformerCalculation = () => {
    const [inputs, setInputs] = useState({
        Sn: 25000,
        Uvn: 115,
        Unn: 6.6,
        Uk: 10.54,
        Umin: 111.37,
        Umax: 114.97,
        Ikzmin: 4508,
        Ikzmax: 12587,
        KTTvn: 400 / 5,
        KTTnn: 1500 / 5,
        KSHvn: 1.73,
        KSHnn: 1,
    });
    const [results, setResults] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: parseFloat(value) });
    };

    const calculateResults = () => {
        const {
            Sn,
            Uvn,
            Unn,
            Uk,
            Umin,
            Umax,
            Ikzmin,
            Ikzmax,
            KTTvn,
            KTTnn,
            KSHvn,
            KSHnn,
        } = inputs;

        // Выполнение расчетов
        const Ivn = Sn / (Uvn * Math.sqrt(3));
        const Inn = Sn / (Unn * Math.sqrt(3));
        const I2vn = (Ivn * KSHvn) / KTTvn;
        const I2nn = (Inn * KSHnn) / KTTnn;

        const Zsmin =
            Math.pow(Umin, 2) / ((Math.sqrt(3) * Umin * Ikzmin) / 1000);
        const Zsmax =
            Math.pow(Umax, 2) / ((Math.sqrt(3) * Umax * Ikzmax) / 1000);

        const XtvPlus =
            ((Uk / 100) * Math.pow(Uvn + 0.16 * Uvn, 2)) / (Sn / 1000);
        const XtvMinus =
            ((Uk / 100) * Math.pow(Uvn - 0.16 * Uvn, 2)) / (Sn / 1000);

        const Ko =
            2.1 -
            3.7 *
                ((Zsmax * (Sn / 1000)) / Math.pow(Uvn, 2) +
                    0.105 +
                    Math.max(Uk) / 120);
        const IudZ = Ko * Ivn;

        const Wv = (100 * 80) / (IudZ * Math.sqrt(3));

        const IudZ_true = (100 * 60) / (Wv * Math.sqrt(3));

        const Wn = (Wv * I2vn) / I2nn;

        const Δf = Math.abs(Wn - Wn.toFixed(0)) / Wn;

		const Ikvnmax = 1000*Umax/(Math.sqrt(3)*(Zsmax+XtvMinus))

		const Inb = Ikvnmax*(1.1*0.1+0.01*16+Δf)

		const Wt_pred = Ko*Wn*Inb/(0.75*Ikvnmax)

		const Xrezplus = 75.2+0.25+14.3

		const Ik3min = 1000*Umin/(Math.sqrt(3)*Xrezplus)

		const k4 = Math.sqrt(3)*Ik3min/(2*IudZ_true)

		const Inbr = Inb*1.73/80

		const Frab = Inbr*Wv

		const Itorm = Ikvnmax*1.73*I2nn/(80*I2vn)

		const Ftorm = Itorm*Wt_pred

		const tgaras = 1.5*Frab/Ftorm

        const results = {
            Ivn: Ivn.toFixed(2),
            Inn: Inn.toFixed(2),
            I2vn: I2vn.toFixed(2),
            I2nn: I2nn.toFixed(2),
            Zsmin: Zsmin.toFixed(2),
            Zsmax: Zsmax.toFixed(2),
            XtvPlus: XtvPlus.toFixed(2),
            XtvMinus: XtvMinus.toFixed(2),
            Ko: Ko.toFixed(2),
            IudZ: IudZ.toFixed(2),
            Wv: Wv.toFixed(0),
            IudZ_true: IudZ_true.toFixed(2),
            Wn: Wn.toFixed(2),
			Wn_fix: Wn.toFixed(0),
            Δf: Δf.toFixed(3),
			Wt_pred: Wt_pred.toFixed(2),
			Wt_fix: Wt_pred.toFixed(0),
			Ikvnmax: Ikvnmax.toFixed(2),
			Inb: Inb.toFixed(2),
			Xrezplus: Xrezplus.toFixed(2),
			Ik3min: Ik3min.toFixed(2),
			k4: k4.toFixed(2),
			Inbr: Inbr.toFixed(2),
			Frab: Frab.toFixed(2),
			Itorm: Itorm.toFixed(2),
			Ftorm: Ftorm.toFixed(2),
			tgaras: tgaras.toFixed(2),
        };

        const formulas = [
            {
                title: "Номинальный ток трансформатора на высокой стороне (Ivn)",
                formula: "I_{vn} = \\frac{S_{n}}{U_{vn} \\cdot \\sqrt{3}}",
                substitution: `I_{vn} = \\frac{${Sn}}{${Uvn} \\cdot \\sqrt{3}}`,
                result: results.Ivn,
            },
            {
                title: "Номинальный ток трансформатора на низкой стороне (Inn)",
                formula: "I_{nn} = \\frac{S_{n}}{U_{nn} \\cdot \\sqrt{3}}",
                substitution: `I_{nn} = \\frac{${Sn}}{${Unn} \\cdot \\sqrt{3}}`,
                result: results.Inn,
            },
            {
                title: "Вторичный номинальный ток на высокой стороне (I2vn)",
                formula: "I_{2vn} = \\frac{I_{vn} \\cdot K_{SHvn}}{K_{TTvn}}",
                substitution: `I_{2vn} = \\frac{${results.Ivn} \\cdot ${KSHvn}}{${KTTvn}}`,
                result: results.I2vn,
            },
            {
                title: "Вторичный номинальный ток на низкой стороне (I2nn)",
                formula: "I_{2nn} = \\frac{I_{nn} \\cdot K_{SHnn}}{K_{TTnn}}",
                substitution: `I_{2nn} = \\frac{${results.Inn} \\cdot ${KSHnn}}{${KTTnn}}`,
                result: results.I2nn,
            },
            {
                title: "Импеданс системы минимальный (Zsmin)",
                formula:
                    "Z_{smin} = \\frac{U_{min}^2}{\\sqrt{3} \\cdot U_{min} \\cdot \\frac{I_{kzmin}}{1000}}",
                substitution: `Z_{smin} = \\frac{${Umin}^2}{\\sqrt{3} \\cdot ${Umin} \\cdot \\frac{${Ikzmin}}{1000}}`,
                result: results.Zsmin,
            },
            {
                title: "Импеданс системы максимальный (Zsmax)",
                formula:
                    "Z_{smax} = \\frac{U_{max}^2}{\\sqrt{3} \\cdot U_{max} \\cdot \\frac{I_{kzmax}}{1000}}",
                substitution: `Z_{smax} = \\frac{${Umax}^2}{\\sqrt{3} \\cdot ${Umax} \\cdot \\frac{${Ikzmax}}{1000}}`,
                result: results.Zsmax,
            },
            {
                title: "Реактативное сопротивление трансформатора плюс (XtvPlus)",
                formula:
                    "X_{tvPlus} = \\frac{(U_{k} / 100) \\cdot (U_{vn} + 0.16 \\cdot U_{vn})^2}{S_{n} / 1000}",
                substitution: `X_{tvPlus} = \\frac{(${Uk} / 100) \\cdot (${Uvn} + 0.16 \\cdot ${Uvn})^2}{ ${Sn} / 1000}`,
                result: results.XtvPlus,
            },
            {
                title: "Реактативное сопротивление трансформатора минус (XtvMinus)",
                formula:
                    "X_{tvMinus} = \\frac{(U_{k} / 100) \\cdot (U_{vn} - 0.16 \\cdot U_{vn})^2}{S_{n} / 1000}",
                substitution: `X_{tvMinus} = \\frac{(${Uk} / 100) \\cdot (${Uvn} - 0.16 \\cdot ${Uvn})^2}{${Sn} / 1000}`,
                result: results.XtvMinus,
            },
            {
                title: "Коэффициент отстройки (Ko)",
                formula:
                    "K_{o} = 2.1 - 3.7 \\cdot ( \\frac{Z_{smax} \\cdot S_{n}}{U_{vn}^2} + 0.105 + \\frac{max(U_{k})}{120})",
                substitution: `K_{o} = 2.1 - 3.7 \\cdot ( \\frac{${
                    results.Zsmax
                } \\cdot ${Sn / 1000}}{${Uvn}^2} + 0.105 + \\frac{${Uk}}{120})`,
                result: results.Ko,
            },
            {
                title: "Предварительная уставка защиты (IudZ')",
                formula: "I_{udZ}' = K_{o} \\cdot I_{vn}",
                substitution: `I_{udZ}\' = ${results.Ko} \\cdot ${results.Ivn}`,
                result: results.IudZ,
            },
            {
                title: "Предварительное число витков реле для стороны ВН (Wv')",
                formula:
                    "W_{v} = \\frac{100 \\cdot K_{1B}}{I_{udZ} \\cdot K_{схВ}}",
                substitution: `W_{v} = \\frac{100 \\cdot 80}{${results.IudZ} \\cdot \\sqrt{3}}`,
                result: results.Wv,
            },
            {
                title: "Уставка защиты для стороны ВН (IуДЗ)",
                formula:
                    "I_{udZ} = \\frac{100 \\cdot K_{1B}}{W_{v} \\cdot K_{схВ}}",
                substitution: `I_{udZ} = \\frac{100 \\cdot 60}{${results.Wv} \\cdot \\sqrt{3}}`,
                result: results.IudZ_true,
            },
            {
                title: "Предварительное число витков реле для стороны НН (Wн')",
                formula: "W_{n} = \\frac{W_{v} \\cdot I_{vn}}{I_{2nn}}",
                substitution: `W_{n} = \\frac{${results.Wv} \\cdot ${results.I2vn}}{${results.I2nn}}`,
                result: results.Wn,
            },
            {
                title: "Относительная погрешность, возникающую вследствие неточности выравнивания ампервитков в плечах защиты (Δf)",
                formula: "Δf = |\\frac{W_{n}' - W_{n}}{W_{n}'}|",
                substitution: `Δf = |\\frac{${
                    results.Wn
                } - ${results.Wn_fix}}{${results.Wn}}|`,
                result: results.Δf,
            },
			{
                title: "Предварительное число витков тормозной обмотки реле (Wт')",
                formula: "Wt' = \\frac{K_{o} \\cdot W \\cdot  I_{nb}}{0.75 \\cdot I_{t}}",
                substitution: `Wt' = \\frac{${results.Ko} \\cdot ${results.Wn} \\cdot  ${results.Inb}}{0.75 \\cdot ${results.Ikvnmax}}`,
                result: results.Wt_pred,
            },
			{
                title: "Коэффициент чувствительности для режимов, когда торможение отсутствует  (Kч)",
                formula: "Kч = \\frac{\\sqrt{3} \\cdot I_k3min}{2 \\cdot I_{уДЗ}}",
                substitution: `Kч = \\frac{\\sqrt{3} \\cdot ${results.Ik3min}}{2 \\cdot ${results.IudZ_true}}`,
                result: results.k4,
            },
			{
                title: "Ток небаланса, приведенный к обмотке реле  (Iнб р)",
                formula: "Iнб р = \\frac{I_нб \\cdot K_cхВ}{ K_cхТ}",
                substitution: `Iнб р = \\frac{${results.Inb} \\cdot 1.73}{ 80}`,
                result: results.Inbr,
            },
			{
                title: "МДС , вызванная током небаланса (Fраб)",
                formula: "F_раб = I_{нб р} \\cdot W_раб",
                substitution: `F_раб = ${results.Inbr} \\cdot ${results.Wv}`,
                result: results.Frab,
            },
			{
                title: "Ток к.з., приведенный к обмотке торможения (Iторм)",
                formula: "Iторм = \\frac{I_{к3 27} \\cdot К_схВ \\cdot I_рн}{К_ттВ \\cdot I_рв}",
                substitution: `Iторм = \\frac{${results.Ikvnmax} \\cdot 1.73 \\cdot ${results.I2nn}}{80 \\cdot ${results.I2vn}}`,
                result: results.Itorm,
            },
			{
                title: "Fторм, вызванная током внешнего к.з (Fторм)",
                formula: "F_торм = I_{торм} \\cdot W_т",
                substitution: `F_торм = ${results.Itorm} \\cdot ${results.Wt_fix}`,
                result: results.Ftorm,
            },
			{
                title: "tgα расчетный (tgα)",
                formula: "tgα = \\frac{K_{отстр} \\cdot F_раб}{F_торм}",
                substitution: `tgα = \\frac{1.5 \\cdot ${results.Frab}}{${results.Ftorm}}`,
                result: results.tgaras,
            },
        ];

        setResults({ results, formulas });
    };

    return (
        <div className="container">
            <h1>Расчет уставок трансформатора</h1>
            <InputForm
                inputs={inputs}
                handleChange={handleChange}
                handleSubmit={calculateResults}
            />
            <Results results={results?.results} formulas={results?.formulas} />
        </div>
    );
};

export default TransformerCalculation;
