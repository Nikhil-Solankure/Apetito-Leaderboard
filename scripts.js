const SHEET_ID = '1b5yydhYkEhzbcZ_4EQcawn5zDbZR5wVeS0D9jBc28DM'; // Replace with your actual Google Sheets ID
const API_KEY = 'AIzaSyDXTOdt7j5NzrZXhnOIfmWTh-92QY2bUOk'; // Replace with your actual API key
const SHEET_NAMES = ['Pelaton-Sprint', 'Packaging-Game', 'Bean-Bag-Game', 'Dementia Chopsticks', 'Hoopla'];

let currentGameIndex = 0;

function fetchGameData(sheetName) {
    const range = `${sheetName}!A2:D`; // Assuming data starts from A2 and columns are Player Name, Department, Distance in Miles, Rank
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    console.log(`Fetching data from: ${url}`);  // Log the URL being called
    return $.get(url)
        .done(function(data) {
            console.log('API call successful. Data received:', data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('API call failed:', textStatus, errorThrown);
        });
}

function updateLeaderboard(data) {
    const rows = data.values.slice(1); // Remove header row
    const sortedRows = rows.sort((a, b) => a[3] - b[3]); // Sort by rank

    // Extract and clean the game name
    let gameName = data.range.split('!')[0];
    gameName = gameName.replace(/['"]+/g, '').trim(); // Remove any quotes or extra spaces

    // Update HTML content with the clean game name
    $('#game-name').text(gameName);

    $('.rank.gold .player-name').text(sortedRows[0][0]);
    $('.rank.gold .department').text(sortedRows[0][1]);
   // $('.rank.gold .distance').text(`${sortedRows[0][2]}`);

    $('.rank.silver .player-name').text(sortedRows[1][0]);
    $('.rank.silver .department').text(sortedRows[1][1]);
  //  $('.rank.silver .distance').text(`${sortedRows[1][2]}`);

    $('.rank.bronze .player-name').text(sortedRows[2][0]);
    $('.rank.bronze .department').text(sortedRows[2][1]);
  //  $('.rank.bronze .distance').text(`${sortedRows[2][2]}`);
}

function cycleGames() {
    fetchGameData(SHEET_NAMES[currentGameIndex])
        .done(updateLeaderboard)
        .fail((jqXHR, textStatus, errorThrown) => {
            console.error('Error fetching data:', textStatus, errorThrown);
            alert('Failed to fetch data');
        });

    currentGameIndex = (currentGameIndex + 1) % SHEET_NAMES.length;
}

$(document).ready(function() {
    cycleGames();
    setInterval(cycleGames, 7000);
});
