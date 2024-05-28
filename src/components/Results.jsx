import { Result } from "antd";
import { MathJax, MathJaxContext } from "better-react-mathjax";
const Results = ({ results, formulas }) => {
    console.log(results);
    return (
        <MathJaxContext>
            <div>
                {results ? (
                    <div>
                        <h2>Результаты:</h2>
                        {formulas.map((formula, index) => (
                            <div key={index} style={{ marginBottom: "20px" }}>
                                <h3>{formula.title}</h3>
                                <p><strong>Формула:</strong>{" "}
                                    <MathJax>{`$$${formula.formula}$$`}</MathJax>
                                </p>
                                <p><strong>Подставленные значения:</strong>{" "}
                                    <MathJax>
                                        {`$$${formula.substitution}= ${formula.result}$$ `}
                                    </MathJax>
                                </p>
								<hr/>
                            </div>
                        ))}

                        {results?.k4 && results?.k4 > 1.5 ? (
                            <Result
                                status="success"
                                title={<span style={{ color: 'white' }}>Коэффициент чувствительности удовлетворяет условию, больше 1,5 </span>}
                            />
                        ) : (
                            <Result
                                status="403"
                                title="Коэффициент чувствительности  не удовлетворяет условию, меньше 1,5 "
                            />
                        )}
                    </div>
                ) : (
                    <p>
                        Введите данные и нажмите "Рассчитать" для получения
                        результатов.
                    </p>
                )}
            </div>
        </MathJaxContext>
    );
};

export default Results;
