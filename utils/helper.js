import moment from 'moment'
export const formateDate = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime()
    if (diff < 60000) {
        return "Now"
    }
    if (diff < 3600000) {
        return `${Math.round(diff / 60000)} min ago`
    }
    if(diff<86400000){
        return `${moment(date).format('h:mm A')}`
    }
    return moment(date).format('MM/DD/YY')
}