const getUsersMask = (users, groupsAndIds) => {
    return users.map(element => groupsAndIds.some(item => element.username.includes(item.id) === true));
}

const applyUsersMask = (users, mask) => {
    return users.filter((item, i) => mask[i])
}

export { getUsersMask, applyUsersMask }
