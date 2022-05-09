import { React, useState } from 'react';
import Multiselect from "multiselect-react-dropdown";
import { getMembers, getRoles } from '../../../src/services/helpers';
import { getUserById } from '../../../src/getUsers';
import axios from 'axios';

export default function item(data) {
    const [all, setAll] = useState(data.allNames);
    const [users, setUsers] = useState({ admin: data.adminNames, member: data.memberNames })

    const submitHandler = async (e) => {
        e.preventDefault();

        if (users.admin.length > 0) {
            try {
                const response = await axios.post(`/api/roles/${data.id}`, { users });
                alert(response.data.alert)
            } catch (e) {
                alert(e)
            }
        } else {
            alert("Please, select at least one DAC-admin")
        }
    };

    const adminHandler = (e) => {
        const swap = users.member.filter((el) => !e.includes(el))
        setUsers({ admin: e, member: swap });
    }

    const memberHandler = (e) => {
        const swap = users.admin.filter((el) => !e.includes(el))
        setUsers({ admin: swap, member: e });
    }

    const dropdownStyle = {
        searchBox: {
            margin: 0,
            border: "none",
            height: 150
        },
        option: { verticalAlign: "middle" }
    };

    return (
        <div class="container">
            <div class="content-wrapper">
                <div class="row justify-content-center text-center">
                    <h2> Manage roles - {data.id} </h2>
                    <div class="col-5 m-1">
                        <div class="card">
                            <div class="card-header">
                                Roles
                            </div>
                            <div class="card-body">
                                <p class="card-text"> Select DAC admin/s </p>
                                <Multiselect
                                    isObject={false}
                                    onSelect={adminHandler}
                                    onRemove={adminHandler}
                                    options={all}
                                    selectedValues={users.admin}
                                    showCheckbox
                                    style={dropdownStyle}
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-5 m-1">
                        <div class="card">
                            <div class="card-header">
                                Roles
                            </div>
                            <div class="card-body">
                                <p class="card-text"> Select DAC member/s </p>
                                <Multiselect
                                    isObject={false}
                                    onSelect={memberHandler}
                                    onRemove={memberHandler}
                                    options={all}
                                    selectedValues={users.member}
                                    showCheckbox
                                    style={dropdownStyle}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center text-center mt-2">
                    <div class="col-6">
                        <button type="button" class="btn btn-success w-100" onClick={(e) => submitHandler(e)}> Send </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;

    const members = await getMembers('dacs', id);

    const roles = await Promise.all(members.map(async (userId) => await getRoles('userRoles', userId)));

    const admin = roles.map(el => (el.roles = el.roles.filter((role) => role.includes(id + ":" + "dac-admin")), el))

    const filteredAdmins = admin.filter(el => el.roles.length > 0 ===  true)

    const filteredMembers = admin.filter(el => el.roles.length > 0 === false)

    const adminInfo = await Promise.all(filteredAdmins.map(async (user) => await getUserById(user.sub)));
    
    const memberInfo = await Promise.all(filteredMembers.map(async (user) => await getUserById(user.sub)));

    const adminNames = adminInfo.flat().map(el => el.username)

    const memberNames = memberInfo.flat().map(el => el.username)

    const allNames = adminNames.concat(memberNames)

    return {
        props: {
            id,
            adminNames,
            memberNames,
            allNames  
        },
    }
}