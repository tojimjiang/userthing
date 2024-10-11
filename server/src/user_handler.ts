// Quick in memory DB. Getting a real DB is really overkill.
// Logic - Given the scope of this problem and given the intrest of time,
/*
 * Just a quick and dirty in memory DB
 * My reasoning is that there is needed functionaility to know existing users of the team.
 * So we can build the user's every time this container boots.
 * Creating a real DB from zero config would add overhead to delivering this. Decided to limit scope creep.
 */
const usersStore = {};
// In theory this should be IDs, but for now for simplicity, use names for now
const blacklistNames = ["slackbot", "jimjiangcomuser"];

export function addUser(slackUserObj) {
  if (!userIsBlacklisted(slackUserObj)) {
    let userId = slackUserObj["id"];
    usersStore[userId] = slackUserObj;
  }
}

function userIsBlacklisted(slackUserObj) {
  return blacklistNames.includes(slackUserObj.name);
}

// Put users into the JavaScript object
export function saveUsers(slackUsersList) {
  slackUsersList.forEach(function (slackUserObject) {
    addUser(slackUserObject);
  });
  console.log(usersStore);
}

export async function scrapeSlackUsers(client) {
  try {
    // Call the users.list method using the WebClient
    const result = await client.users.list();
    saveUsers(result.members);
  } catch (error) {
    console.error(error);
  }
}

export function handleQuery() {
  let usersList = Object.values(usersStore);
  let returnObject = [];
  console.log(usersStore);
  usersList.forEach((user: {id: string, team_id: string, name: string, real_name: string, profile: {status_text: string, status_emoji: string, status_expiration: Date, email: string, image_192: string}}) => {
    returnObject.push({
      id: user.id,
      team_id: user.team_id,
      name: user.name,
      real_name: user.real_name,
      status: {
        text: user.profile?.status_text || "",
        emoji: user.profile?.status_emoji || "",
        expiration: 1000 * Number(user.profile?.status_expiration || 0) ,
      },
      email: user.profile?.email,
      profile_image: user.profile?.image_192
    });
  })
  return returnObject;
}
