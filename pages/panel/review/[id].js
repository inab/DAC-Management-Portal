import { React } from 'react';
import axios from 'axios';
import { getDacInfo } from '../../../src/services/helpers';

export default function item(data) {
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
        <div class="container">
            <div class="content-wrapper">
                <div class="form-dac">
                    <form onSubmit={(e) => submitHandler(e)} class="login-form">
                        <label> DAC Name </label>
                        <input class="input" placeholder={data.dacInfo.dacName} disabled />
                        <label> DAC Study </label>
                        <input class="input" placeholder={data.dacInfo.dacStudy} disabled />
                        <label> DAC Datasets </label>
                        <input class="input" placeholder={data.dacInfo.datasets} disabled />
                        <label> DAC-admin name </label>
                        <input class="input" placeholder={data.dacInfo.adminName} disabled />
                        <label> DAC-admin surname </label>
                        <input class="input" placeholder={data.dacInfo.adminSurname} disabled />
                        <label> DAC-admin email </label>
                        <input class="input" placeholder={data.dacInfo.emailAddress} disabled />
                        <label> Study description </label>
                        <input class="input" placeholder={data.dacInfo.studyDescription} disabled />
                    </form>
                    <div class="row justify-content-center text-center mt-2">
                        <div class="col-6">
                            <button type="button" class="btn btn-success w-100" onClick={(e) => submitHandler(e, true)}> Accept </button>
                        </div>
                        <div class="col-6">
                            <button type="button" class="btn btn-danger w-100" onClick={(e) => submitHandler(e, false)}> Reject </button>
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