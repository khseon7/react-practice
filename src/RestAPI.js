import React, { useState, useEffect } from "react";
import axios from "axios";
import "C:/Users/gkrtj/Desktop/세종대/Django_React/react-practice/src/RestAPI.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function RestAPI() {
    const [models, setModels] = useState([]);
    const [modelname, setModelname] = useState("");
    const [target, setTarget] = useState("");
    const [csvFile, setCsvFile] = useState(null);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = () => {
        axios.get(`${API_BASE_URL}/model/`)
            .then(response => {
                setModels(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
    };

    const handleModelSubmit = () => {
        const formData = new FormData();
        formData.append('modelname', modelname);
        formData.append('target', target);
        if (csvFile) {
            formData.append('csv_file', csvFile);
        }

        axios.post(`${API_BASE_URL}/model/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log(response);
            fetchModels(); // 새 데이터 가져오기
        })
        .catch(error => {
            console.log(error);
        });
    };

    return (
        <>
            <h1>Model과 target</h1>
            <div className="input-container">
                <p>Input Model_name = <input
                    type="text"
                    placeholder="Modelname"
                    value={modelname}
                    onChange={(e) => setModelname(e.target.value)}
                /></p>
                <p>Input Model's target = <input
                    type="text"
                    placeholder="target"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                /></p>
                <p>Input Your DataSet = <input
                    type="file"
                    onChange={handleFileChange}
                /></p>
            </div> 
            <div className="btn-model-primary">
                <button onClick={handleModelSubmit}>
                    POST
                </button>
                <button onClick={fetchModels}>GET</button>
            </div>
            <div className="model-list">
            {models.map((e) => (
                <div key={e.id} className="list-item">
                    <div className="list">
                        <span>
                            {e.id}번, {e.modelname}, {e.target}
                            {e.result !== null ? `, ${e.result}` : ''},
                        </span>
                        {e.original_filename && <span> {e.original_filename}</span>}{"\t"}
                        <button className="btn-model-delete" onClick={() => {
                            axios.delete(`${API_BASE_URL}/model/${e.id}`)
                                .then(() => {
                                    setModels(models.filter((model) => model.id !== e.id));
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }}>
                            DELETE
                        </button>
                    </div>
                </div>
            ))}</div>
        </>
    );
}

export default RestAPI;
