import { App, Variable, Astal, Gtk, Widget } from "astal"

const time = Variable<string>("").poll(1000, "date")

export default function Bar(monitor = 0) {
    return Widget.Window(
        {
            className: "Bar",
            monitor,
            exclusivity: Astal.Exclusivity.EXCLUSIVE,
            anchor: Astal.WindowAnchor.TOP
                | Astal.WindowAnchor.LEFT
                | Astal.WindowAnchor.RIGHT,
            application: App,
        },
        Widget.CenterBox({},
            Widget.Button(
                {
                    onClicked: "echo hello",
                    halign: Gtk.Align.CENTER,
                },
                Widget.Label({
                    label: "hello",
                }),
            ),
            Widget.Box(),
            Widget.Button(
                {
                    onClicked: () => print("hello"),
                    halign: Gtk.Align.CENTER,
                },
                Widget.Label({
                    label: time(),
                }),
            ),
        ),
    )
}
