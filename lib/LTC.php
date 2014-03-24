<?php

/**
 * Lunch Time Coordinator
 * Handles the reading and responding to commands as well as calculates 
 * lunch schedules.
 *
 * @author Shaun Burdick <github@shaunburdick.com>
 * @see https://github.com/shaunburdick/slack-ltc
 */

class LTC
{
    /** Commands */
    const CMD_IN            = 'IN';
    const CMD_AT            = 'AT';
    const CMD_TO            = 'TO';
    const CMD_NO            = 'NO';

    /**
     * Constructor
     * @return LTC
     */
    public function __construct() {

    }

    /**
     * Parse commands into actions.
     * Splits a string of space separated commands and their arguments.
     * @example 'in at >12:00pm' becomes [ ['cmd' => 'IN', 'args' => []], ['cmd' => 'AT', 'args' => ['>12:00pm']] ]
     * @param string $raw The raw list of commands and params
     * @return array [ [cmd => cmd1, args => [arg1, arg2,...]], ...)
     */
    public function parseCommands($raw) {
        $retVal = array();
        $currentCmd = null;
        $currentArgs = array();

        $splody = explode(' ', $raw);
        if(!empty($splody)) {
            foreach($splody as $item) {
                switch(strtoupper($item)) {
                    case static::CMD_IN:
                    case static::CMD_AT:
                    case static::CMD_TO:
                    case static::CMD_NO:
                        /** Finish the previous action */
                        if($currentCmd !== null) {
                            $retVal[] = array(
                                'cmd'   => $currentCmd,
                                'args'  => $currentArgs
                            );
                        }

                        /** Start new action */
                        $currentCmd = strtoupper($item);
                        $currentArgs = array();
                        break;
                    default:
                        /** If not a command then it must be an argument */
                        $currentArgs[] = $item;
                }
            }

            /** Snag the last action */
            if($currentCmd !== null) {
                $retVal[] = array(
                    'cmd'   => $currentCmd,
                    'args'  => $currentArgs
                );
            }
        }

        return $retVal;
    }
}