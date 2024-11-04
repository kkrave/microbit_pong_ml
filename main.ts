function Guess_Initialize () {
    guess_array = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
    ]
}
input.onButtonPressed(Button.A, function () {
    P1a.change(LedSpriteProperty.X, -1)
    P1b.set(LedSpriteProperty.X, P1a.get(LedSpriteProperty.X) + 1)
})
function Guess_Make () {
    // every combination of ball starting X and Direction has a different  index (0 to 14)
    index = ball.get(LedSpriteProperty.X) + randomDir * 5 + 5
    guessCPU = guess_array[index]
    guessCPUround = Math.round(guessCPU)
}
function Game_Settings () {
    LearningRate = 2
    StartSpeed = 1
    SpeedProgression = true
}
function RandomBallDirection () {
    basic.pause(Delay)
    randomDir = Math.randomRange(-1, 1)
    // For Player1, randomize the ball direction and position of the ball coming off the 2LED paddle
    if (ball.get(LedSpriteProperty.Y) == 4) {
        randomPos = Math.randomRange(0, 1)
        if (randomPos == 0) {
            ball.set(LedSpriteProperty.X, P1a.get(LedSpriteProperty.X))
        } else {
            ball.set(LedSpriteProperty.X, P1b.get(LedSpriteProperty.X))
        }
        ball.set(LedSpriteProperty.Direction, randomDir * 45)
    } else {
        // For CPU, randomize the direction only
        ball.set(LedSpriteProperty.Direction, randomDir * 45 + 180)
    }
}
input.onButtonPressed(Button.B, function () {
    if (P1b.get(LedSpriteProperty.X) < 4) {
        P1a.change(LedSpriteProperty.X, 1)
        P1b.set(LedSpriteProperty.X, P1a.get(LedSpriteProperty.X) + 1)
    }
})
function moveCPU () {
    if (CPU.get(LedSpriteProperty.X) < guessCPUround) {
        CPU.change(LedSpriteProperty.X, 1)
    } else if (CPU.get(LedSpriteProperty.X) > guessCPUround) {
        CPU.change(LedSpriteProperty.X, -1)
    }
}
function Guess_Learn () {
    LearnCountCPU += 1
    guessError = Math.abs(guessCPU - ball.get(LedSpriteProperty.X))
    TotalError = TotalError + guessError
    AvgError = TotalError / LearnCountCPU
    guess_array[index] = LearningRate * ball.get(LedSpriteProperty.X) + (1 - LearningRate) * guessCPU
    serial.writeValue("LearnCount", LearnCountCPU)
    serial.writeValue("data.Error", guessError)
    serial.writeValue("data.AvgError", AvgError)
}
function Game_Initialize () {
    ball = game.createSprite(0, 4)
    P1a = game.createSprite(2, 4)
    P1b = game.createSprite(3, 4)
    CPU = game.createSprite(2, 0)
    ball.set(LedSpriteProperty.Brightness, 255)
    P1a.set(LedSpriteProperty.Brightness, 128)
    P1b.set(LedSpriteProperty.Brightness, 128)
    CPU.set(LedSpriteProperty.Brightness, 128)
    ball.set(LedSpriteProperty.Direction, 45)
    LearnCountCPU = 0
    CPUscore = 0
    P1score = 0
    AvgError = 0
    TotalError = 0
    Delay = 300 + StartSpeed
    basic.pause(Delay)
}
let P1score = 0
let CPUscore = 0
let AvgError = 0
let TotalError = 0
let guessError = 0
let LearnCountCPU = 0
let CPU: game.LedSprite = null
let randomPos = 0
let Delay = 0
let SpeedProgression = false
let StartSpeed = 0
let LearningRate = 0
let guessCPUround = 0
let guessCPU = 0
let randomDir = 0
let ball: game.LedSprite = null
let index = 0
let P1b: game.LedSprite = null
let P1a: game.LedSprite = null
let guess_array: number[] = []
Game_Settings()
Game_Initialize()
Guess_Initialize()
basic.forever(function () {
    ball.move(1)
    basic.pause(Delay)
    if (ball.get(LedSpriteProperty.Y) == 0) {
        Guess_Learn()
        if (ball.isTouching(CPU)) {
            RandomBallDirection()
        } else {
            P1score += 1
            CPU.set(LedSpriteProperty.Blink, Delay / 10)
            ball.ifOnEdgeBounce()
        }
        basic.pause(Delay)
    } else if (ball.get(LedSpriteProperty.Y) == 4) {
        if (ball.isTouching(P1a) || ball.isTouching(P1b)) {
            RandomBallDirection()
        } else {
            CPUscore += 1
            P1a.set(LedSpriteProperty.Blink, Delay / 10)
            P1b.set(LedSpriteProperty.Blink, Delay / 10)
            ball.ifOnEdgeBounce()
        }
        Guess_Make()
        moveCPU()
        basic.pause(Delay)
    } else {
        ball.ifOnEdgeBounce()
        moveCPU()
        basic.pause(Delay)
    }
    moveCPU()
    basic.pause(Delay)
    P1a.set(LedSpriteProperty.Blink, 0)
    P1b.set(LedSpriteProperty.Blink, 0)
    CPU.set(LedSpriteProperty.Blink, 0)
    if (SpeedProgression) {
        Delay += -0.01 * Delay
    }
})
