# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


## Execution Details
- The Hasher contract is deployed on the Sepolia testnet at address 0xe58fE4a822bdf1EEe43e10DEf31Bb5614018939D
- On Player 2 turn, if a 'TransactionExecutionError' is caught, retry the turn again in a few seconds
- Set desired stake, 'player 2` address, move, and random salt, then hash move & salt, before creating a game
- The generated salt, and move, must be hashed before deploying the contract
- Once contract is finishsed deploying, an alert will display to you the deployed contract's address
- Player 2 must use that contract address, and the appropriate stake when playing his turn
- Player 1 finally submits their original move & salt to solve the game, and to determine the winner

- Please repeat the Hash(c1, salt) button, or submit buttons if they don't work the first try around


| P1\P2    | Rock          | Paper           | Scissors  | Spock | Lizard |
| -------- |:-------------:|:---------------:|:---------:|:-----:|:------:|
| Rock     |      0,0         |  -1,1           |      1,-1 |     -1,1  |    1,-1    |
| Paper    | 1,-1      | 0,0   |     -1,1 |    1,-1   |     -1,1   |
| Scissors | -1,1    | 1,-1        |       0,0 |   -1,1    |  1,-1      |
| Spock    | 1,-1 | -1,1        |    1,-1 |    0,0   | -1,1       |
| Lizard   | -1,1 | 1,-1        |      -1,1 |   1,-1    |  0,0      |


E[payoff for P1 playing Rock] = 0 * q<sub>r</sub> - 1 *  q<sub>p</sub>  + 1 * q<sub>s</sub>  - 1 * q<sub>sp</sub> + 1 * q<sub>Liz</sub> = -q<sub>p</sub> + q<sub>s</sub> - q<sub>sp</sub> + q<sub>Liz</sub><br />
E[payoff for P1 playing Paper] = 1 * q<sub>r</sub> + 0 *  q<sub>p</sub>  - 1 *  q<sub>s</sub>  + 1 * q<sub>sp</sub> - 1 * q<sub>Liz</sub> = q<sub>r</sub> - q<sub>s</sub> + q<sub>sp</sub> - q<sub>Liz</sub><br />
E[payoff for P1 playing Scissors] = -1 * q<sub>r</sub> + 1 * q<sub>p</sub>  + 0 *  q<sub>s</sub>  - 1 * q<sub>sp</sub> + 1 * q<sub>Liz</sub> = -q<sub>r</sub> + q<sub>p</sub> - q<sub>sp</sub> + q<sub>Liz</sub><br />
E[payoff for P1 playing Spock] = 1 * q<sub>r</sub> - 1 * q<sub>p</sub>  + 1 * q<sub>s</sub>  + 0 * q<sub>sp</sub> - 1 * q<sub>Liz</sub> = q<sub>r</sub> - q<sub>p</sub> + q<sub>s</sub> - q<sub>Liz</sub><br />
E[payoff for P1 playing Lizard] = -1 * q<sub>r</sub> + 1 * q<sub>p</sub>  - 1 * q<sub>s</sub>  + 1 * q<sub>sp</sub> + 0 * q<sub>Liz</sub> = -q<sub>r</sub> + q<sub>p</sub> - q<sub>s</sub>  + q<sub>sp</sub><br />

The mixed strategy nash equilibrium for this game is for each player to randomly choose one of the five {Rock, Paper, Scissors, Spock, Lizard} with a probability of 1/5 for each of them.