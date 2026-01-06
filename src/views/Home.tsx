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
				<p tw="mb-7">
					守リクシ個供ヨ良久ヘユ旅分ろ一助響ばす止与こ杯油ツマ養8団8当マヱ株妻帯てび。外スつび皇囲上那ネ更広ぐひ点意ーぞっず別転載い氷的トモタ束閣ラさに諭察イ販社ノマスケ公春環けびに。1質ケマコ棄連ーんッラ論引過んこ指詐ルノフ非10府エコソセ禁付つお紙京てる行地国型のリぐう述所び入痛嗣坪みひめ。
					<br />
					<br />
					5九で著医ルみうざ他実マケ京死ロ想伸クスエイ長個石ネキヘ青配ルヘコ息掲ヌキリ賞久スホクコ著新をめそず力要やル次公ド説団頭枠こまよほ。式レ強大元き新環ムマユカ業著ロヤアヲ都学済学じす必劭サマ属異ばよし時住げぶドが愛可みこ亡況乙吟噛れねドレ。模シラ野認ゆイ南犯ふイが境罪ぽ歳捕記テ器老53載ユ問囲ほンぴだ秀3則トムス測8過ユフヱ措優以午彰戦ぽばッゃ。
				</p>
				<p>
					義全記豊掲界発甲告津春許愛廟辞社問向。考極咋提円売部昌組事重令業手布会踏況異島。敏人主実闘樹読戦費王取相見台介面難選釈。新公収四快娘写響告志臓決漫係伊合稿事超。存暮新会第詩必式景種能本脳消治有郎子女。掲後社一庫直斐重戦著務済改現当反。奈天健信頼願地棋成狙者新十泉退奈。用毎団言戦首主的初柏参社厘。
					<br />
					<br />
					化観提格戦達放池療京兆一。長眺任性一台外求下男伊媛実座。玉意米市会本示順戦督図追。横細驚旨確著購郷高族備問悩毎。賛活出万治告避聞銀技日定証芸聞込際。座出初業代戸石月目注追峙答更返用投多月者。終府印練最負放三申組江隊怖新感。極落辞他暮研捕約意算行様拉法都。読暮結実短千界折思万北不未坂需原証。朝金加係非死要多著棋海加要化。
				</p>
			</div>
			<div tw="py-7 flex flex-col gap-7">
				<div tw="max-w-xl">
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
