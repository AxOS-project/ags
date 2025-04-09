pkgname=sleex-ags
pkgver=r550.67b0e31
pkgrel=1
pkgdesc="Aylurs's Gtk Shell (AGS), version fixed for Sleex."
arch=('x86_64')
license=('GPL3')
makedepends=('git' 'gobject-introspection' 'meson' 'npm' 'typescript')
depends=('gjs' 'glib2' 'glib2-devel' 'glibc' 'gtk3' 'gtk-layer-shell' 'libpulse' 'pam')
optdepends=('gnome-bluetooth-3.0: required for bluetooth service'
            'greetd: required for greetd service'
            'libdbusmenu-gtk3: required for systemtray service'
            'libsoup3: required for the Utils.fetch feature'
            'libnotify: required for sending notifications'
            'networkmanager: required for network service'
            'power-profiles-daemon: required for powerprofiles service'
            'upower: required for battery service')
conflicts=('aylurs-gtk-shell' 'aylurs-gtk-shell-git')
backup=('etc/pam.d/ags')

prepare() {
  cd $srcdir
  git submodule init
  git config submodule.subprojects/gvc.url "$srcdir/libgnome-volume-control"
  git -c protocol.file.allow=always submodule update
}

build() {
  cd $srcdir
  npm install
  arch-meson build --libdir "lib/$_pkgname" -Dbuild_types=true
  meson compile -C build
}

package() {
  cd $srcdir
  meson install -C build --destdir "$pkgdir"
  ln -sf /usr/share/com.github.Aylur.ags/com.github.Aylur.ags ${pkgdir}/usr/bin/ags
}
