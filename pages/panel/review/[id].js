import { React, useState } from 'react';
import axios from 'axios';
import { getDacInfo } from '../../../src/services/helpers';

export default function item(data) {
    
    return (
        <div class="main">
            <div class="panel">
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
                        <button> Accept </button>
                        <button> Reject </button>
                    </form>
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
            dacInfo
        },
    }
}