# Manual Finance Customer Mode

When the authenticated capability reports `MANUAL_FINANCE`, Bank Transfer navigation remains
available and renders configured contact instructions, accessible telephone/email links, the owned
invoice reference and currency, and a copy-reference control. It states that no payment is recorded
and no Booking is confirmed until cleared funds are verified.

The page does not request bank instructions or render review creation, proof upload/replacement, or
self-service workflow controls. Contact text is escaped and no contact value is hardcoded. Switching
to SELF_SERVICE is backend configuration plus restart; the existing V14 customer journey then
renders unchanged.
