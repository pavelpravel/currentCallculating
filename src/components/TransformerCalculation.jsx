import { useState } from "react";
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
        KTTvn: 80,
        KTTnn: 300,
        KSHvn: 1.73,
        KSHnn: 1,
        kper: 1.1,
        kodn: 1,
        epsi: 0.1,
        ka: 16.0,
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
            kper,
            kodn,
            epsi,
            ka,
        } = inputs;

        // Выполнение расчетов
        const Ivn = Sn / (Uvn * Math.sqrt(3));
        const Inn = Sn / (Unn * Math.sqrt(3));

        const Zsmin =
            Math.pow(Umin, 2) / ((Math.sqrt(3) * Umin * Ikzmin) / 1000);
        const Zsmax =
            Math.pow(Umax, 2) / ((Math.sqrt(3) * Umax * Ikzmax) / 1000);

        const XtvPlus =
            ((Uk / 100) * Math.pow(Uvn + 0.16 * Uvn, 2)) / (Sn / 1000);
        const XtvMinus =
            ((Uk / 100) * Math.pow(Uvn - 0.16 * Uvn, 2)) / (Sn / 1000);

        const XtnPlus =
            ((Uk / 100) * Math.pow(Unn + 0.16 * Unn, 2)) / (Sn / 1000);
        const XtnMinus =
            ((Uk / 100) * Math.pow(Unn - 0.16 * Unn, 2)) / (Sn / 1000);

        const xresPlus = XtvPlus + XtnPlus + Zsmin;

        const I2vn = (Ivn * KSHvn) / KTTvn;
        const I2nn = (Inn * KSHnn) / KTTnn;
        const Ko = 1.5;
        const Iszmin = Ko * Ivn;
        const Icrvn = (Iszmin * KSHvn) / KTTvn;
        const Wvnrasch = 100 / Icrvn;
        const Wnrasch = (Wvnrasch * I2vn) / I2nn;

        const Δf = Math.abs(Wnrasch - Wnrasch.toFixed(0)) / Wnrasch;

        const Ikvnmax = (1000 * Umax) / (Math.sqrt(3) * (Zsmax + XtvMinus));
        const Inbrasch = Ikvnmax * (kper * kodn * epsi + 0.01 * ka + Δf);

        const Wt_pred = (Ko * Wnrasch * Inbrasch) / (0.75 * Ikvnmax);

        const Xrezplus = 75.2 + 0.25 + 14.3;
        const Ik3min = (1000 * Umin) / (Math.sqrt(3) * Xrezplus);
        const k4 = (Math.sqrt(3) * Ik3min) / (2 * Iszmin);
        const Inb = (Inbrasch * 1.73) / 80;
        const Frab = Inb * Wvnrasch;
        const Itorm = (Ikvnmax * 1.73 * I2nn) / (80 * I2vn);
        const Ftorm = Itorm * Wt_pred;
        const tgaras = (1.5 * Frab) / Ftorm;

        const a = 0.0006658 
        const b = 0.866
        const c =  92.198

        const kb = 0.866-Ftorm/Frab


        const discr = kb*kb - 4*a*c
        const Ftorm_ = (-kb-Math.sqrt(discr))/(2*a)

        const frab_ = Math.pow(Ftorm_,2)*a+Ftorm_*b+c



        const results = {
            Ivn: Ivn.toFixed(2),
            Inn: Inn.toFixed(2),
            Zsmin: Zsmin.toFixed(2),
            Zsmax: Zsmax.toFixed(2),
            XtvPlus: XtvPlus.toFixed(2),
            XtvMinus: XtvMinus.toFixed(2),
            XtnPlus: XtnPlus.toFixed(2),
            XtnMinus: XtnMinus.toFixed(2),
            xresPlus: xresPlus.toFixed(2),
            I2vn: I2vn.toFixed(2),
            I2nn: I2nn.toFixed(2),
            Ko: Ko.toFixed(2),
            Iszmin: Iszmin.toFixed(2),
            Icrvn: Icrvn.toFixed(2),
            Wvnrasch: Math.floor(Wvnrasch),
            Wnrasch: Math.ceil(Wnrasch),
            Wnrasch_fix: Wnrasch.toFixed(2),
            Δf: Δf.toFixed(3),
            Wt_fix: Math.floor(Wt_pred),
            Ikvnmax: Ikvnmax.toFixed(2),
            Inbrasch: Inbrasch.toFixed(2),
            Inb: Inb.toFixed(2),
            Ik3min: Ik3min.toFixed(2),
            k4: k4.toFixed(2),
            Frab: Frab.toFixed(2),
            Itorm: Itorm.toFixed(2),
            Ftorm: Ftorm.toFixed(2),
            tgaras: tgaras.toFixed(2),
            frab_: frab_.toFixed(2),
            
            
        };

        const graph = {
            a: a,
            b: b,
            c: c,
            Frab: Frab.toFixed(2),
            Ftorm: Ftorm.toFixed(2),
            Ftorm_: Ftorm_,
            frab_: frab_,
        };


        const formulas = [
            {
                title: "Номинальный ток трансформатора на высокой стороне (I(вн)))",
                formula: "I_{(ВН)} = \\frac{S_{ном}}{U_{ном} \\cdot \\sqrt{3}}",
                substitution: `I_{(ВН)} = \\frac{${Sn}}{${Uvn} \\cdot \\sqrt{3}}`,
                result: results.Ivn,
            },
            {
                title: "Номинальный ток трансформатора на низкой стороне (I(нн))",
                formula: "I_{(НН)} = \\frac{S_{ном}}{U_{ном} \\cdot \\sqrt{3}}",
                substitution: `I_{(НН)} = \\frac{${Sn}}{${Unn} \\cdot \\sqrt{3}}`,
                result: results.Inn,
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
                title: "Реактативное сопротивление трансформатора плюс ВН (XtvPlus)",
                formula:
                    "X_{ТВ+} = \\frac{(U_{k} / 100) \\cdot (U_{vn} + 0.16 \\cdot U_{vn})^2}{S_{n} / 1000}",
                substitution: `X_{ТВ+} = \\frac{(${Uk} / 100) \\cdot (${Uvn} + 0.16 \\cdot ${Uvn})^2}{ ${Sn} / 1000}`,
                result: results.XtvPlus,
            },
            {
                title: "Реактативное сопротивление трансформатора минус ВН (XtvMinus)",
                formula:
                    "X_{ТВ-} = \\frac{(U_{k} / 100) \\cdot (U_{vn} - 0.16 \\cdot U_{vn})^2}{S_{n} / 1000}",
                substitution: `X_{ТВ-} = \\frac{(${Uk} / 100) \\cdot (${Uvn} - 0.16 \\cdot ${Uvn})^2}{${Sn} / 1000}`,
                result: results.XtvMinus,
            },
            {
                title: "Реактативное сопротивление трансформатора плюс НН (Xтн+)",
                formula:
                    "X_{ТН+} = \\frac{(U_{k} / 100) \\cdot (U_{нн} + 0.16 \\cdot U_{vn})^2}{S_{n} / 1000}",
                substitution: `X_{ТН+} = \\frac{(${Uk} / 100) \\cdot (${Unn} + 0.16 \\cdot ${Unn})^2}{ ${Sn} / 1000}`,
                result: results.XtnPlus,
            },
            {
                title: "Реактативное сопротивление трансформатора минус НН (Xтн-)",
                formula:
                    "X_{ТН-} = \\frac{(U_{k} / 100) \\cdot (U_{нн} - 0.16 \\cdot U_{vn})^2}{S_{n} / 1000}",
                substitution: `X_{ТН-} = \\frac{(${Uk} / 100) \\cdot (${Unn} - 0.16 \\cdot ${Unn})^2}{${Sn} / 1000}`,
                result: results.XtnMinus,
            },
            {
                title: "Cопротивление стороны ВН, НН  (приведённое к стороне ВН) в максимальном положении РПН и сопротивление энергосистемы в режиме минимума (Xрез+)",
                formula: "X_{рез+} = X_{ТВ+}  + X_{ТН+} + Z_{smin}",
                substitution: `X_{рез+} = ${results.XtvPlus} + ${results.XtnPlus} + ${results.Zsmin}`,
                result: results.xresPlus,
            },
            {
                title: "Вторичный номинальный ток на высокой стороне (I2vn)",
                formula: "I_{2(ВН)} = \\frac{I_{vn} \\cdot K_{SHvn}}{K_{TTvn}}",
                substitution: `I_{2(ВН)} = \\frac{${results.Ivn} \\cdot ${KSHvn}}{${KTTvn}}`,
                result: results.I2vn,
            },
            {
                title: "Вторичный номинальный ток на низкой стороне (I2nn)",
                formula: "I_{2(НН)} = \\frac{I_{nn} \\cdot K_{SHnn}}{K_{TTnn}}",
                substitution: `I_{2(НН)} = \\frac{${results.Inn} \\cdot ${KSHnn}}{${KTTnn}}`,
                result: results.I2nn,
            },
            {
                title: "Минимальные ток срабатывания защиты  (Iszmin)",
                formula: "I_{szmin} = K_{o} \\cdot I_{vn}",
                substitution: `I_{szmin} = ${results.Ko} \\cdot ${results.Ivn}`,
                result: results.Iszmin,
            },
            {
                title: "ток срабатывания реле на основной стороне (Icrvn)",
                formula:
                    "I_{с.р.вн} = \\frac{K_{схВ} \\cdot I_{с.з.}}{K_{1ВН}}",
                substitution: `I_{с.р.вн} = \\frac{${KSHvn} \\cdot ${results.Iszmin}}{${KTTvn}}`,
                result: results.Icrvn,
            },
            {
                title: "необходимое число витков рабочей обмотки НТТ реле для основной и других сторон (Wвн.расч)",
                formula: "W_{вн.расч} = \\frac{F_{с.р}}{I_{с.р.вн}}",
                substitution: `W_{вн.расч} = \\frac{100}{${results.Icrvn}}`,
                result: results.Wvnrasch,
            },

            {
                title: "Предварительное число витков реле для стороны НН (Wннрасч)",
                formula:
                    "W_{ннрасч} = \\frac{W_{вн.расч} \\cdot I_{2vn}}{I_{2nn}}",
                substitution: `W_{ннрасч} = \\frac{${results.Wvnrasch} \\cdot ${results.I2vn}}{${results.I2nn}}`,
                result: results.Wnrasch,
            },
            {
                title: "Относительная погрешность, возникающую вследствие неточности выравнивания ампервитков в плечах защиты (Δf)",
                formula: "Δf = |\\frac{W_{нн.расч} - W_{нн}}{W_{нн.расч}}|",
                substitution: `Δf = |\\frac{${results.Wnrasch_fix} - ${results.Wnrasch}}{${results.Wnrasch}}|`,
                result: results.Δf,
            },
            {
                title: "Ток небаланса, расчетный  (Iнб расч)",
                formula: "I_{нб расч} = k_{пер} * k_{одн} * ε +0.01*a + Δf",
                substitution: `I_{нб расч} = ${kper} * ${kodn} * ${epsi} +0.01*${ka} + ${results.Δf}`,
                result: results.Inbrasch,
            },

            {
                title: "Ток небаланса, приведенный к обмотке реле  (Iнб)",
                formula: "I_{нб} = \\frac{I_{нб расч} \\cdot K_{cхВ}}{ K_cхТ}",
                substitution: `I_{нб} = \\frac{${results.Inbrasch} \\cdot ${KSHvn}}{ ${KSHnn}}`,
                result: results.Inb,
            },

            {
                title: "Предварительное число витков тормозной обмотки реле (Wторм расч)",
                formula:
                    "W_{торм расч} = \\frac{K_{o} \\cdot W \\cdot  I_{nb}}{0.75 \\cdot I_{t}}",
                substitution: `W_{торм расч} = \\frac{${results.Ko} \\cdot ${results.Wnrasch} \\cdot  ${results.Inbrasch}}{0.75 \\cdot ${results.Ikvnmax}}`,
                result: results.Wt_fix,
            },

            {
                title: "Чувствительность защиты при металлическом кз в защищаемой зоне, когда отсутствует торможение  (Kч)",
                formula:
                    "K_ч = \\frac{\\sqrt{3} \\cdot I_{k3min}}{2 \\cdot I_{сз мин}}",
                substitution: `K_ч = \\frac{\\sqrt{3} \\cdot ${results.Ik3min}}{2 \\cdot ${results.Iszmin}}`,
                result: results.k4,
            },

            {
                title: "МДС , вызванная током небаланса (Fраб)",
                formula: "F_{раб} = I_{нб} \\cdot W_{раб}",
                substitution: `F_{раб} = ${results.Inb} \\cdot ${results.Wvnrasch}`,
                result: results.Frab,
            },
            {
                title: "Ток к.з., приведенный к обмотке торможения (Iторм)",
                formula:
                    "I_{торм} = \\frac{I_{к3 27} \\cdot К_{схВ} \\cdot I_рн}{К_{ттВ} \\cdot I_{рв}}",
                substitution: `I_{торм} = \\frac{${results.Ikvnmax} \\cdot 1.73 \\cdot ${results.I2nn}}{80 \\cdot ${results.I2vn}}`,
                result: results.Itorm,
            },
            {
                title: "Fторм, вызванная током внешнего к.з (Fторм)",
                formula: "F_{торм} = I_{торм} \\cdot W_т",
                substitution: `F_{торм} = ${results.Itorm} \\cdot ${results.Wt_fix}`,
                result: results.Ftorm,
            },
            {
                title: "Fраб, по графику (раб, с.р)",
                //formula: "F_{раб, с.р}",
                substitution: `F_{раб, с.р} = ${results.Frab_}`,
                result: results.frab_,
            },
        ];

        setResults({ results, formulas, graph });
    };

    return (
        <div className="container">
            <h1>Расчет уставок трансформатора</h1>
            <InputForm
                inputs={inputs}
                handleChange={handleChange}
                handleSubmit={calculateResults}
            />
            <Results results={results?.results} formulas={results?.formulas} graph={results?.graph}/>
        </div>
    );
};

export default TransformerCalculation;
