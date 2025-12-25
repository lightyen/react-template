import { useSelect } from "~/context"
import { FormattedMessage, useIntl } from "~/i18n"

export function Home() {
	const isMobile = useSelect(state => state.app.mobile)
	return (
		<article tw="flex flex-col gap-5">
			<div tw="max-w-xl">
				<h1 tw="font-bold text-lg mb-5">What is Lorem Ipsum? {isMobile ? "mobile" : "desktop"}</h1>
				<p tw="mb-7">
					<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
					been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a
					galley of type and scrambled it to make a type specimen book. It has survived not only five
					centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
					popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
					more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
					Ipsum.
				</p>
				<p>
					治ちて記出ぱこぎ学6福ム渡忠査ツトニホ催据じほぱ服普サ施無エ政広でまみお始舎るにもふ事着るくこ視10人籍てび河成えは向頼難くンっつ。護タライ方通えら意馬ツキ億強温モロノ連竹ニ作第ょお容68本続ホ権町べくぐー運新メム週援売奥リ。問シ決転ま長主42堺の続中江ル食野づラて平強オク会世ンゆろ版駆ゆ族雪ヨトハネ車45費や積写特異利カヨソ振年ふぱべ公反フ。
					済合ごへー情禁ロサヲ読約ずが迎清ラエ雇界ソワ芸希天ぎほそ教9替ぴげざ発着タヤヨア採場ちみりの国干悟栽桂ぎ。一ケホワロ敏中正ヱヨニ都松据ゅう能二ル受寒ワスカ混出ンみ件色ヤ高鎮マラスウ未喜てえ保分へッ給不あ白事て友児らづおこ。同刊うにょ写市ろぐン再北あク稿要ヤヒ識国列キス試健てたフ得47打距94打距7北の紙委兵じ航国ツハケ題楽償ヒヲ再業ロスミ供職事べ鈴奈雑世よふじん。
					企戦ノキマヒ花気む場志ン決利だ意6顔コセ辞行ハアマ阪際ぽめひ子三演胎ねぜきド位末コ求難モテホヤ業稿ッ席経民ごぶスト。自ぽごい量8半おス香夜リム予身ヲシ写化津ウニ球騒おべら連植フよるね月表リウ裏供ワカ合幕ネチムホ政選まばだや用締休ゆっ。康ぜむ式募くどラ掛50栃3不ーへえ苦屋銃をおつ文健あでとり打群ロモ人原ルざい過南ラカ欠席ケミヘ高者目レクヘル訪六フさす挙慣葬は。
					治メヘ帰集ッつさぐ紙携げぐも次独ソ判小シ陳民たわい火超ま池政ケヌツ碁毎ヘ記声56発ばむょ図国ほず之指ゅッ口73端れ。
				</p>
			</div>
			<div tw="py-7 flex flex-col gap-7">
				<div tw="max-w-xl">
					<h1 tw="font-bold text-lg mb-4">中文假文產生器</h1>
					<p tw="mb-4">
						本有時候不出的了一下，這篇親卡哈哈戴口罩可能⋯知道是莉的是。類似就是了有弱也想就不，加油ㄉ的力，這兩共很少他不。不意外最愛的動作什，到底是，真天是一樣讓他來才，朋友話說，要不要大概我是就為，人想也只手。
					</p>
					<p tw="mb-4">
						經過，沒有會想⋯來如此要來，真的體的吃東是很聽起可以看：不明不然的快樂網大學生⋯心得我今天。
					</p>
					<p tw="mb-4">
						喜歡的了希望部台灣，也有不好會是困擾這種時也⋯就直接些當我就是是好得很也喜歡，在幹嘛特別知道是那你用下這，他年星期束多人他臨終一次，直接看不是我還沒面就一。
					</p>
					<MyTime />
					<Test1 />
					<Test2 />
					<Test3 />
				</div>
				<div>
					<a
						href="https://ui.shadcn.com/"
						tw="hover:underline accent-accent"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://ui.shadcn.com/
					</a>
				</div>
			</div>
		</article>
	)
}

function MyTime() {
	const { format, formatDuration } = useIntl(s => s.dateFns)
	return (
		<div tw="whitespace-pre">
			{format(new Date(), "PPPpp")}
			<br />
			{formatDuration(32777)}
		</div>
	)
}

function Test1() {
	return <FormattedMessage id="test" values={{ value: <strong>Eric</strong> }} />
}

function Test2() {
	const intl = useIntl(s => s.intl)
	const data = intl.formatMessage(
		{ id: "test" },
		{
			value: <strong>Eric1</strong>,
		},
	)
	return <div>{data}</div>
}

function Test3() {
	const intl = useIntl(s => s.intl)
	const data = intl.formatMessage(
		{ id: "test_rich" },
		{
			p: chunks => <p>{chunks}</p>,
			value: <strong>Eric2</strong>,
		},
	)
	return <div>{data}</div>
}
