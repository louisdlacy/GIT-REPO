export const dialogueData = {
    messageDataIndex: 0,
    messageIndex: 0,
}

type MessageData = {
    messages: string[];
};

export const DialogueMap = new Map<string, MessageData[]>([
    ["Dog",
        [
            {
                messages: ["Woof! Woof!"]
            },
            {
                messages: ["Woof...?"]
            },
            {
                messages: [
                    "Alright, what do you want?",
                    "I mean...",
                    "WOOF!"
                ]
            }
        ]
    ],
    ["Cat",
        [
            {
                messages: [
                    "Meow! Meow!",
                    "What'd you think I was going to say?",
                ]
            },
            {
                messages: [
                    "..."
                ]
            }
        ]
    ]
])