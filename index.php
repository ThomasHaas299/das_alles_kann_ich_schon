<?php

$c = new calc();

?>
	<!DOCTYPE html>
	<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
		<title>Rechnen</title>
		<script type="text/javascript" src="./jquery-1.12.3.min.js"></script>
		<!--suppress CssUnusedSymbol -->
		<style type="text/css">
			body {
				font-family: sans-serif;
			}

			h1 {
				text-align: center;
			}

			label {
				cursor: pointer;
			}

			#results table {
				border-collapse: collapse;
			}

			#tdSpacer {
				width: 100px;
			}

			.outerTable {
				/* width: 700px; */
			}

			.innerTable td {
				text-align: right;
				font-size: 16pt;
				height: 40px;
			}

			.innerTable td.val {
				padding-left: 10px;
			}

			.innerTable td.op {
				font-weight: bold;
				text-align: center;
				min-width: 40px;
			}

			@media print {
				form {
					display: none;
				}
			}


		</style>
	</head>
	<body>

	<h1 onclick="location.href='?';">Das alles kann ich schon</h1>

	<form action="?" method="post">
		<div>
			<fieldset id="fsType">
				<legend>Aufgabentyp</legend>
				<label><input type="checkbox" name="type[]" value="add"/>Addition</label>
				<label><input type="checkbox" name="type[]" value="sub"/>Subtraktion</label>
				<label><input type="checkbox" name="type[]" value="tim"/>Multiplikation</label>
				<label><input type="checkbox" name="type[]" value="div"/>Division</label>
			</fieldset>

			<fieldset id="fsMix">
				<legend>Aufgabentypen mischen</legend>
				<label><input type="radio" name="mix" value="1"/>ja</label>
				<label><input type="radio" name="mix" value="0"/>nein</label>
			</fieldset>

			<fieldset>
				<legend>Ergänzungsaufgaben</legend>
				<label><input type="radio" name="complement" value="1"/>ja</label>
				<label><input type="radio" name="complement" value="0"/>nein</label>
			</fieldset>

			<fieldset>
				<legend>Kommutativgesetz</legend>
				<label><input type="radio" name="commutative" value="1"/>ja</label>
				<label><input type="radio" name="commutative" value="0"/>nein</label>
			</fieldset>

			<fieldset id="fsAddSub">
				<legend>Addition/Subtraktion</legend>
				<table>
					<tr>
						<td>Max-Ergebnis:</td>
						<td><input type="text" name="max_result" size="4"/></td>
					</tr>
					<tr>
						<td>Min-Ergebnis:</td>
						<td><input type="text" name="min_result" size="4"/></td>
					</tr>
					<tr>
						<td>Max-Rechenzahl:</td>
						<td><input type="text" name="max_calc" size="4"/></td>
					</tr>
					<tr>
						<td>Min-Rechenzahl:</td>
						<td><input type="text" name="min_calc" size="4"/></td>
					</tr>
				</table>
			</fieldset>

			<fieldset id="fsTimDiv">
				<legend>Multiplikation/Division</legend>
				<b>x1:</b>
				<label><input type="checkbox" name="x1[]" value="0"/>0</label>
				<label><input type="checkbox" name="x1[]" value="1"/>1</label>
				<label><input type="checkbox" name="x1[]" value="2"/>2</label>
				<label><input type="checkbox" name="x1[]" value="3"/>3</label>
				<label><input type="checkbox" name="x1[]" value="4"/>4</label>
				<label><input type="checkbox" name="x1[]" value="5"/>5</label>
				<label><input type="checkbox" name="x1[]" value="6"/>6</label>
				<label><input type="checkbox" name="x1[]" value="7"/>7</label>
				<label><input type="checkbox" name="x1[]" value="8"/>8</label>
				<label><input type="checkbox" name="x1[]" value="9"/>9</label>
				<label><input type="checkbox" name="x1[]" value="10"/>10</label>
				<label><input type="checkbox" name="x1[]" value="11"/>11</label>
				<label><input type="checkbox" name="x1[]" value="12"/>12</label>
				<label><input type="checkbox" name="x1[]" value="13"/>13</label>
				<label><input type="checkbox" name="x1[]" value="14"/>14</label>
				<label><input type="checkbox" name="x1[]" value="15"/>15</label>
				<label><input type="checkbox" name="x1[]" value="16"/>16</label>
				<label><input type="checkbox" name="x1[]" value="17"/>17</label>
				<label><input type="checkbox" name="x1[]" value="18"/>18</label>
				<label><input type="checkbox" name="x1[]" value="19"/>19</label>
				<label><input type="checkbox" name="x1[]" value="20"/>20</label>
				<label><input type="checkbox" name="x1[]" value="21"/>21</label>
				<label><input type="checkbox" name="x1[]" value="22"/>22</label>
				<label><input type="checkbox" name="x1[]" value="23"/>23</label>
				<label><input type="checkbox" name="x1[]" value="24"/>24</label>
				<label><input type="checkbox" name="x1[]" value="25"/>25</label>
				<br/>
				<label><b>Max-x2:</b> <input type="text" name="max_x2" size="4"/> (mindestens 10)</label>
			</fieldset>

			<input type="submit" value="Aufgaben erstellen"/>
			<input type="submit" value="Standard laden" name="loadStandards"/>
			<input type="button" value="Drucken" onclick="window.print();"/>

		</div>
	</form>

	<script type="text/javascript">
		<?php
		echo $c->obtainJsData();
		?>

		function check_visibility(isStart) {

			var duration = 0;	// 250 oder 400
			if (isStart) {
				duration = 0;
			}

			var isAdd = $(":checkbox[name=\'type[]\'][value=add]").is(":checked");
			var isSub = $(":checkbox[name=\'type[]\'][value=sub]").is(":checked");
			var isTim = $(":checkbox[name=\'type[]\'][value=tim]").is(":checked");
			var isDiv = $(":checkbox[name=\'type[]\'][value=div]").is(":checked");

			if ((isAdd || isSub)) {
				$("#fsAddSub").show(duration);
			} else {
				$("#fsAddSub").hide(duration);
			}

			if ((isTim || isDiv)) {
				$("#fsTimDiv").show(duration);
			} else {
				$("#fsTimDiv").hide(duration);
			}

			// var cntTypes = $(":checkbox[name=\'type[]\']:checked").size();
			// if (cntTypes % 2 == 0) {
			// $("#fsMix").show(duration);
			// } else {
			// $("#fsMix").hide(duration);
			// }
		}
		check_visibility(1);

		$(":checkbox[name=\'type[]\']").click(function () {
			check_visibility(0)
		});

	</script>

	<div id="result">
		<?php
		// echo pr($c->getValues());
		echo $c->tasks();
		?>
	</div>

	</body>
	</html>
<?php

class calc {

	private $values = array();
	private $error;

	public function __construct() {
		$this->loadDefaults();
		if (!empty($_POST)) {
			$this->saveData();
		}
		$this->loadData();

	}

	public function getValues() {
		return $this->values;
	}

	public function obtainJsData() {
		$s = '';

		$v =& $this->values;
		foreach ($v['type'] as $type) {
			$s .= sprintf('$(":checkbox[name=\'type[]\'][value=%s]").prop("checked","true");', $type);
		}
		$s .= '$(":radio[name=mix][value='.$v['mix'].']").prop("checked","true");';
		$s .= '$(":radio[name=complement][value='.$v['complement'].']").prop("checked","true");';
		$s .= '$(":radio[name=commutative][value='.$v['commutative'].']").prop("checked","true");';
		$s .= '$(":text[name=max_result]").val('.$v['max_result'].');';
		$s .= '$(":text[name=min_result]").val('.$v['min_result'].');';
		$s .= '$(":text[name=max_calc]").val('.$v['max_calc'].');';
		$s .= '$(":text[name=min_calc]").val('.$v['min_calc'].');';
		$s .= "\n\n";
		foreach ($v['x1'] as $x1) {
			$s .= '$(":checkbox[name=\'x1[]\'][value='.$x1.']").prop("checked","true");';
		}
		$s .= '$(":text[name=max_x2]").val('.$v['max_x2'].');';

		return $s;
	}

	private function saveData() {

		if (empty($_POST['type'])) {
			$this->error = 'Bitte mindestens einen Aufgabentyp angeben!';
			return;
		}

		if (empty($_POST['x1'])) {
			// wenn kein x1 angegeben wird, werden die Standards geladen
			$_POST['x1'] = $this->values['x1'];
		}

		$ints = array('max_result', 'min_result', 'max_calc', 'min_calc', 'max_x2');
		foreach ($ints as $int) {
			$_POST[$int] = (int)$_POST[$int];
		}

		if ($_POST['max_result'] <= $_POST['min_result']) {
			$_POST['max_result'] = $_POST['min_result'] + 1;
		}

		if ($_POST['max_calc'] <= $_POST['min_calc']) {
			$_POST['max_calc'] = $_POST['min_calc'] + 1;
		}

		if ($_POST['max_x2'] < 10) {
			$_POST['max_x2'] = 10;
		}

		$values = array();

		foreach ($this->values as $k => $v) {
			$values[$k] = $_POST[$k];
		}
		file_put_contents('data.dat', serialize($values));
	}

	private function loadData() {
		// aussteigen, wenn loadStandards kommt
		if (isset($_POST['loadStandards'])) {
			return;
		}
		if (file_exists('data.dat')) {
			$this->values = unserialize(file_get_contents('data.dat'));
		}
	}

	private function loadDefaults() {
		$defaults = array();
		$defaults['type'][] = 'add';
		$defaults['type'][] = 'sub';
		$defaults['mix'] = 1;
		$defaults['complement'] = 0;
		$defaults['commutative'] = 0;
		$defaults['max_result'] = 100;
		$defaults['min_result'] = 20;
		$defaults['max_calc'] = 17;
		$defaults['min_calc'] = 4;
		$defaults['x1'][] = 0;
		$defaults['x1'][] = 1;
		$defaults['x1'][] = 2;
		$defaults['x1'][] = 4;
		$defaults['x1'][] = 10;
		$defaults['max_x2'] = 10;
		$this->values = $defaults;
	}

	public function tasks() {

		$num = 40;

		// Tasks erstellen
		$t = array();
		for ($i = 0; $i < $num; $i++) {
			$t['add'][] = new TaskAdd($this->values);
			$t['sub'][] = new TaskSub($this->values);
			$t['tim'][] = new TaskTim($this->values);
			$t['div'][] = new TaskDiv($this->values);

		}

		// TODO: Tasks zusammensammeln
		$tt = array();
		$numOfTasks = count($this->values['type']);
		if ($numOfTasks == 1) {
			$tt = $t[$this->values['type'][0]];
		}
		if ($numOfTasks == 2) {
			$tt = array_merge(
				array_slice($t[$this->values['type'][0]], 0, ceil($num / 2)),
				array_slice($t[$this->values['type'][1]], 0, ceil($num / 2))
			);
		}
		if ($numOfTasks == 3) {
			$tt = array_merge(
				array_slice($t[$this->values['type'][0]], 0, ceil($num / 3)),
				array_slice($t[$this->values['type'][1]], 0, ceil($num / 3)),
				array_slice($t[$this->values['type'][2]], 0, ceil($num / 3))
			);
		}
		if ($numOfTasks == 4) {
			$tt = array_merge(
				array_slice($t[$this->values['type'][0]], 0, ceil($num / 4)),
				array_slice($t[$this->values['type'][1]], 0, ceil($num / 4)),
				array_slice($t[$this->values['type'][2]], 0, ceil($num / 4)),
				array_slice($t[$this->values['type'][3]], 0, ceil($num / 4))
			);
		}

		if ($this->values['mix']) {
			shuffle($tt);
		}

		// Rückgabe
		$s = '<table class="outerTable"><tr><td><table class="innerTable">';
		$i = 0;
		foreach ($tt as $task) {

			if ($i >= $num) {
				break;
			}

			if ($i == $num / 2) {
				$s .= '</table></td><td id="tdSpacer">&nbsp;</td><td><table class="innerTable">';
			}

			$s .= $task;
			$i++;
		}

		$s .= '</table></td></tr></table>';

		return $s;

	}

}

abstract class Task {


	const PLATZHALTER = '____';

	protected $values;
	protected $x1;
	protected $x2;
	protected $r;
	protected $operator;


	/**
	 * @var float wenn größer als 1 höhere Präferenz für größere Zahlen,
	 *              wenn kleiner als 1 höhere Präferenz für kleinere Zahlen
	 */
	private $rndPow = 1.7;

	public function __construct($values) {
		$this->values = $values;
	}

	protected function setRndPow($rndPow) {
		$this->rndPow = $rndPow;
		if ($rndPow <= 0) {
			$this->rndPow = 1;
		}
}

	/**
	 * x1 und x2 vertauschen (Anwendung Kommutativgesetz)
	 */
	protected function flipX1X2() {
		$tmp = $this->x1;
		$this->x1 = $this->x2;
		$this->x2 = $tmp;
	}

	protected function rndBool() {
		return mt_rand(0, 1);
	}

	public function __toString() {

		if ($this->values['complement']) {
			switch (mt_rand(0, 2)) {
				default:
				case 0:
					$this->r = self::PLATZHALTER;
					break;
				case 1:
					$this->x1 = self::PLATZHALTER;
					break;
				case 2:
					$this->x2 = self::PLATZHALTER;
					break;
			}


		} else {
			$this->r = self::PLATZHALTER;
		}

		// return sprintf("<div>%s %s %s = %s</div>", $this->x1, $this->operator, $this->x2, $this->r);
		return sprintf('<tr><td class="val">%s</td><td class="op">%s</td><td class="val">%s</td><td class="eq">=</td><td class="val">%s</td></tr>', $this->x1, $this->operator, $this->x2, $this->r);
	}

	protected function myRand($min, $max, $rndPow = false) {
		$rndval = mt_rand() / mt_getrandmax();

		$max = $max+1;

		$tmpRndPow = $this->rndPow;
		if ($rndPow !== false) {
			$this->setRndPow($rndPow);
		}
		$mRndPow = $this->rndPow;
		$this->setRndPow($tmpRndPow);

		if ($mRndPow === 1) {
			return mt_rand($min, $max);
		}

		return floor(pow($rndval, 1/ $mRndPow) * ($max - $min)) + $min;

		// return mt_rand($min, $max);
	}


}

class TaskTim extends Task {

	public function __construct($values) {
		parent::__construct($values);
		// $this->r = mt_rand($this->values['min_result'], $this->values['max_result']);
		// $this->x2 = mt_rand($this->values['min_calc'], $this->values['max_calc']);

		$x1Key = array_rand($this->values['x1']);
		$x1 = $this->values['x1'][$x1Key];
		$x2 = mt_rand(0, $this->values['max_x2']);
		// hier sind die Begrifflichkeiten vertauscht
		$this->x1 = $x2;
		$this->x2 = $x1;
		$this->r = $this->x1 * $this->x2;

		$this->operator = '&middot;';

		if ($this->values['commutative'] && $this->rndBool()) {
			$this->flipX1X2();
		}

	}

}

class TaskDiv extends TaskTim {
	public function __construct($values) {
		parent::__construct($values);
		$this->operator = ':';

		$r = $this->x1;
		$this->x1 = $this->r;
		$this->r = $r;

		if ($this->x1 == 0 && $this->x2 == 0) {
			$this->__construct($values);
		}

	}
}


class TaskAdd extends Task {

	public function __construct($values) {
		parent::__construct($values);
		$this->r = $this->myRand($this->values['min_result'], $this->values['max_result'], 3);
		$this->x2 = $this->myRand(min($this->r, $this->values['min_calc']), min($this->r, $this->values['max_calc']));
		$this->x1 = $this->r - $this->x2;

		$this->operator = '+';

		if ($this->values['commutative'] && $this->rndBool()) {
			$this->flipX1X2();
		}

	}

}

class TaskSub extends TaskAdd {
	public function __construct($values) {
		parent::__construct($values);
		$this->operator = '&ndash;';    // Gedankenstrich Breite n

		$r = $this->x1;
		$this->x1 = $this->r;
		$this->r = $r;

	}
}


function pr($v) {
	return '<pre>'.print_r($v, true).'</pre>';
}

?>