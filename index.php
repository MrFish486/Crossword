<?php
$w = 0;
$h = 0;

if (!isset($_GET["w"]) || !isset($_GET["h"])) {
	header("Location: /?w=10&h=10");
	exit;
}

try {
	$w = intval($_GET["w"]);
	$h = intval($_GET["h"]);
} catch (Exception $e) {
	header("Location: /?w=10&h=10");
	exit;
}

if ($w < 1) {
	header("Location: /?w=1&h=" . $h);
	exit;
}

if ($h < 1) {
	header("Location: /?w=" . $w . "&h=1");
	exit;
}

?>
<html>
	<head>
		<link rel="stylesheet" href="styles/index.css"></link>
		<script>
			const WIDTH = <?= $w ?>;
			const HEIGHT = <?= $h ?>;
		</script>
		<script src="scripts/index.js"></script>
	</head>
	<body>
		<canvas id="viewport" width="500px" height="500px"></canvas>
		<div class="p"></div>
		<textarea placeholder="clues" id="clues"></textarea>
		<div class="p"></div>
		<table>
			<tr>
				<td></td>
				<td>
					<?php if ($h > 1) { ?>
						<form action="/" method="GET">
							<input value="<?= $w ?>" name="w" type="hidden" hidden></input>
							<input value="<?= $h - 1 ?>" name="h" type="hidden" hidden></input>
							<button type="submit">- Height</button>
						</form>
					<?php } ?>
				</td>
				<td></td>
			</tr>
			<tr>
				<td>
					<?php if ($w > 1) { ?>
						<form action="/" method="GET">
							<input value="<?= $w - 1 ?>" name="w" type="hidden" hidden></input>
							<input value="<?= $h ?>" name="h" type="hidden" hidden></input>
							<button type="submit">- Width</button>
						</form>
					<?php } ?>
				</td>	
				<td>
					<button id="print">(<?= $w ?>x<?= $h ?>) Print</button>
				</td>
				<td>
					<form action="/" method="GET">
						<input value="<?= $w + 1 ?>" name="w" type="hidden" hidden></input>
						<input value="<?= $h ?>" name="h" type="hidden" hidden></input>
						<button type="submit">Width +</button>
					</form>
				</td>
			</tr>
			<tr>
				<td></td>
				<td>
					<form action="/" method="GET">
						<input value="<?= $w ?>" name="w" type="hidden" hidden></input>
						<input value="<?= $h + 1 ?>" name="h" type="hidden" hidden></input>
						<button type="submit">Height +</button>
					</form>
				</td>
				<td></td>
			</tr>
		</table>
	</body>
</html>
