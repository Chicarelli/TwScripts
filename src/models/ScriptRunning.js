export class ScriptRunning {
  _isRunning = false;

  constructor(isRunning = false) {
    this._isRunning = window.sessionStorage.getItem('farm_execution');
  }

  get isRunning() {
    return this._isRunning;
  }

  onStart() {
    window.sessionStorage.setItem('farm_execution', true);
    this._isRunning = true;
  }

  onPause() {
    window.sessionStorage.setItem('farm_execution', false);
    this._isRunning = false;
  }

}