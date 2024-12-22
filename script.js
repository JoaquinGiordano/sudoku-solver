class Sudoku {
  constructor(container, resolve_button, size = 3) {
    this.container = container;
    this.size = Math.max(3, size);
    this.board = [];
    this.#load_matrix();
    this.#render_sudoku();
    if (resolve_button) {
      resolve_button.addEventListener('click', () => {
        this.solve(0, 0);
        this.#render_sudoku();
      });
    }
  }

  #is_valid_row(row, num) {
    return !this.board[row].includes(num);
  }

  #is_valid_column(col, num) {
    return this.board.every(row => row[col] != num);
  }

  #is_valid_subgrid(row, col, num) {
    let valid = true;

    for (let i = Math.floor(row / 3) * 3; i < Math.floor(row / 3) * 3 + 3; i++) {
      for (let j = Math.floor(col / 3) * 3; j < Math.floor(col / 3) * 3 + 3; j++) {
        if (this.board[i][j] == num) {
          valid = false;
        }
      }
    }
    return valid;
  }

  is_valid(row, col, num) {
    return this.#is_valid_row(row, num) && this.#is_valid_column(col, num) && this.#is_valid_subgrid(row, col, num);
  }

  solve(row = 0, col = 0) {
    if (row == this.size * 3) return true;
    if (col == this.size * 3) return this.solve(row + 1, 0);
    if (this.board[row][col] != 0) return this.solve(row, col + 1);

    for (let num = 1; num <= this.size * 3; num++) {
      if (this.is_valid(row, col, num)) {
        this.board[row][col] = num;
        if (this.solve(row, col + 1)) {
          return true;
        }
        this.board[row][col] = 0;
      }
    }
    return false;
  }

  #load_matrix() {
    this.board = Array(3 * this.size)
      .fill()
      .map(() => Array(3 * this.size).fill(0));
  }

  #render_sudoku() {
    this.container.innerHTML = '';
    const aux_matrix = Array(3 * this.size)
      .fill()
      .map(() => Array(3 * this.size).fill(0));

    for (let i = 0; i < this.size * 3; i++) {
      for (let j = 0; j < this.size * 3; j++) {
        const input = document.createElement('input');
        input.id = `sudoku-input-${i}.${j}`;
        input.classList.add('sudoku-cell', `sudoku-col-${j}`);
        input.type = 'number';
        input.value = this.board[i][j] == 0 ? '' : this.board[i][j];
        input.min = 0;
        input.max = 9;

        input.addEventListener('change', e => {
          let value = Math.max(Math.min(9, e.target.value), 0);
          e.target.value = value;
          this.board[i][j] = value;
          if (this.board[i][j] == 0) {
            input.value = '';
          }
        });
        aux_matrix[i][j] = input;
      }
    }
    for (let i = 0; i < this.size * 3; i++) {
      const row = document.createElement('div');
      row.id = `sudoku-row-${i}`;
      row.classList.add('sudoku-row');
      row.append(...aux_matrix[i]);
      this.container.append(row);
    }
  }
}

const sudoku = new Sudoku(document.querySelector('#sudoku-container'), document.querySelector('#sudoku-solve-button'));
