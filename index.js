import Component from "can-component";
import DefineList from "can-define/list/list";
import SimpleObservable from "can-simple-observable";
import SetterObservable from "can-simple-observable/setter/setter"
import canReflect from "can-reflect";
import Observation from "can-observation";

import "can-stache-converters";
import "./app.less";

const ROWS = 8;
const COLS = 8;

const emptyBitmap = () => {
	const bitmap = new DefineList([]);

	for (let rowNum = 0; rowNum < ROWS; rowNum++) {
		let row = new DefineList([]);

		for (let colNum = 0; colNum < COLS; colNum++) {
			row.push(new SimpleObservable(false));
		}

		bitmap.push(row);
	}

	return bitmap;
};

Component.extend({
	tag: "pixel-tree",
	view: `
		<nav>
			<label>
				<input type="radio" checked:bind="equal(step, 'trunk')">
				draw trunk
			</label>
			<label>
				<input type="radio" checked:bind="equal(step, 'liveLeaves')">
				add leaves
			</label>
			<label>
				<input type="radio" checked:bind="equal(step, 'deadLeaves')">
				move leaves
			</label>
			<button>&#x25b6; Play</button>
		</nav>
		<table>
			{{#each(pixels, cols=value row=index)}}
				<tr>
					{{#each(cols, col=index)}}
					<td on:click="scope.root.color(col, ../row)" class:from="scope.root.getValue(this)">
					</td>
					{{/each}}
				</tr>
			{{/each}}
		</table>
	`,
	ViewModel: {
		step: { default: "trunk" },

		pixels: {
			default() {
				const pixels = new DefineList([]);

				for (let rowNum = 0; rowNum < ROWS; rowNum++) {
					let row = new DefineList([]);

					for (let colNum = 0; colNum < COLS; colNum++) {
						let value = new Observation(() => {
							const isTrunk = canReflect.getValue(this.trunk[rowNum][colNum]);
							const isLiveLeaf = canReflect.getValue(this.liveLeaves[rowNum][colNum]);
							const isDeadLeaf = canReflect.getValue(this.deadLeaves[rowNum][colNum]);

							return isDeadLeaf
								? "dead-leaf"
								: isLiveLeaf
									? "leaf"
									: isTrunk
										? "trunk"
										: "";
						});

						row.push(value);
					}
					pixels.push(row);
				}

				return pixels;
			}
		},

		trunk: {
			default() {
				return emptyBitmap();
			}
		},

		liveLeaves: {
			default() {
				return emptyBitmap();
			}
		},

		deadLeaves: {
			default() {
				return emptyBitmap();
			}
		},

		color(col, row) {
			const container = this[this.step];
			canReflect.setValue(container[row][col], !canReflect.getValue(container[row][col]));
		},

		getValue(obs) {
			return canReflect.getValue(obs);
		}
	}
});
