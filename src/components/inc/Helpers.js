export function formatNumber (number) {
    if(!number) return 0;
    number = Math.round(number*100)/100
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function toTokenValue(number) {
    if(!number) return 0;
    return number/100000000;
}

export function formatTokenAmount(number) {
    return formatNumber(toTokenValue(number)) + ' ARN';
}

export function blocksToTime(blocks, blocks_rate = 5) {
    return formatTime(blocks*blocks_rate);
}
function formatTime(time) {
    //var days = Math.floor(time / 3600 / 24);
    //time -= days * 3600 * 24;

    var hours = Math.floor(time / 3600);
    time -= hours * 3600;
    
    var minutes = Math.floor(time / 60);
    time -= minutes * 60;

    var output = '';
    if(hours === 1) {
        output += '1 hour';
    }
    if(hours > 1) {
        output += hours + ' hours';
    }
    if(output === '' && minutes === 1) {
        output += '1 minute';
    }
    if(output === '' && minutes > 1) {
        output += minutes + ' minutes';
    }
    if(output === '')
    {
        output = time + ' seconds'
    }
    return 'in ' + output;
     
 }

export function calculateAPY(percent = 1, blocks_per_reward = 3, blocks_rate = 5) {
    let rewards_year = 365 * 24 * 60 * 60 / blocks_rate / blocks_per_reward;
    return formatNumber(percent * rewards_year * 100) + '%';
}