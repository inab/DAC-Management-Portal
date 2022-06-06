import { React } from 'react';
import axios from 'axios';
import { getDacInfo } from '../../../src/services/helpers';

export default function Item(data) {
    const submitHandler = async (e, status) => {
        e.preventDefault();
        try {
            await axios.post(`/api/review/${data.id}`, { status });
            alert("Status: Updated")
        } catch (e) {
            alert(e)
        }
    };
    return (
        <div className="container">
            <div className="content-wrapper">
                <div className="form-dac">
                    <form onSubmit={(e) => submitHandler(e)} className="login-form">
                        <label> DAC Name </label>
                        <input className="input" placeholder={data.dacInfo.dacName} disabled />
                        <label> DAC Study </label>
                        <input className="input" placeholder={data.dacInfo.dacStudy} disabled />
                        <label> DAC Datasets </label>
                        <input className="input" placeholder={data.dacInfo.datasets} disabled />
                        <label> DAC-admin name </label>
                        <input className="input" placeholder={data.dacInfo.adminName} disabled />
                        <label> DAC-admin surname </label>
                        <input className="input" placeholder={data.dacInfo.adminSurname} disabled />
                        <label> DAC-admin email </label>
                        <input className="input" placeholder={data.dacInfo.emailAddress} disabled />
                        <label> Study description </label>
                        <input className="input" placeholder={data.dacInfo.studyDescription} disabled />
                    </form>
                    <div className="row justify-content-center text-center mt-2">
                        <div className="col-6">
                            <button type="button" className="btn btn-success w-100" onClick={(e) => submitHandler(e, true)}> Accept </button>
                        </div>
                        <div className="col-6">
                            <button type="button" className="btn btn-danger w-100" onClick={(e) => submitHandler(e, false)}> Reject </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;
    const dacInfo = await getDacInfo("dacs", id);

    return {
        props: {
            dacInfo,
            id
        },
    }
}