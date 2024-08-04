class ReactorPanelItem extends Item {
    constructor(pos, name="Control Panel", animation=control_panel_animation) {
        super(pos, name, animation);
    }

    use(player) {
        facility_self_destruct_active = true;
    }
}
