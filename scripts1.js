const SHEET_ID = '1b5yydhYkEhzbcZ_4EQcawn5zDbZR5wVeS0D9jBc28DM'; // Replace with your actual Google Sheets ID
const API_KEY = 'AIzaSyDXTOdt7j5NzrZXhnOIfmWTh-92QY2bUOk'; // Replace with your actual API key
const SHEET_NAMES = ['Sheet1', 'Sheet2', 'Card Castle', 'Dementia Chopsticks', 'Hoopla'];


let currentGameIndex = 0;

function fetchGameData(sheetName) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
    return $.get(url);
}

function updateLeaderboard(data) {
    const rows = data.values.slice(1); // Remove header row
    const sortedRows = rows.sort((a, b) => a[3] - b[3]); // Sort by rank

    // Update HTML content
    $('#game-name').text(data.range.split('!')[0]);

    $('.rank.gold .player-name').text(sortedRows[0][0]);
    $('.rank.gold .department').text(sortedRows[0][1]);
    $('.rank.gold .distance').text(`${sortedRows[0][2]} miles`);

    $('.rank.silver .player-name').text(sortedRows[1][0]);
    $('.rank.silver .department').text(sortedRows[1][1]);
    $('.rank.silver .distance').text(`${sortedRows[1][2]} miles`);

    $('.rank.bronze .player-name').text(sortedRows[2][0]);
    $('.rank.bronze .department').text(sortedRows[2][1]);
    $('.rank.bronze .distance').text(`${sortedRows[2][2]} miles`);
}

function cycleGames() {
    fetchGameData(SHEET_NAMES[currentGameIndex])
        .done(updateLeaderboard)
        .fail(() => alert('Failed to fetch data'));

    currentGameIndex = (currentGameIndex + 1) % SHEET_NAMES.length;
}

$(document).ready(function() {
    cycleGames();
    setInterval(cycleGames, 5000);
});
