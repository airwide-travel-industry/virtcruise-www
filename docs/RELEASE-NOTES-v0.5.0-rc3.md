# Virtcruise Frontend v0.5.0-rc3

Status: validated frontend release candidate; not deployed.

## Summary

RC3 is a frontend-only correction to the RC2 guest navigation acceptance failure. The registration
page and authentication flow already existed, but the guest renderer generated only a Sign In link.
It now generates separate Sign In and Register links in the existing desktop and mobile navigation
containers.

## Scope

- Add a semantic **Register** anchor linking to `/register/` beside **Sign In** for guests.
- Preserve the authenticated avatar, customer name, portal links and Logout controls.
- Add minimal gold/navy styling and an explicit visible keyboard-focus outline.
- Add a mandatory real-Chrome regression gate for desktop, tablet and mobile navigation.

The authentication provider, session discovery, token handling, protected routes and backend API
contract are unchanged. The matching backend remains `v0.5.0-rc2`.

## Validation

The navigation gate checks actual computed visibility rather than DOM presence alone. It verifies:

- Sign In and Register are visible, unclipped and pointer-operable for guests;
- Register has the exact accessible name and `/register/` target;
- Register follows Sign In in keyboard tab order and retains a visible focus outline;
- the navigation introduces no horizontal overflow;
- authenticated navigation contains neither guest link and retains account and Logout controls;
- the same behavior holds at 1920×1080, 1024×768 and 390×844.

## Known limitations

RC3 does not add payments, supplier booking, consultant workflows or content-fingerprinted assets.
Production Gmail and full authenticated lifecycle acceptance remain deployment-time gates.
